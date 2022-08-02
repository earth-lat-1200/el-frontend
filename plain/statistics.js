const hourConverter = 3600;
const millisConverter = 1000

let currentStationName
let currentDate
let chartColors = []
let sendTimesChart
let sendTimesDataPoints
let temperatureChart
let temperatureDataPoints
let promises = []

$(document).ready(function () {
    configureChartJSDefaults()
    $('#datePicker')[0].value = new Date().toISOString().substring(0, 10);
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
    get("http://localhost:7071/api/StationNames", loadStationNames, headers);
});

function configureChartJSDefaults() {
    Chart.defaults.color = "#ffffff";
    Chart.defaults.font.family = 'Rubik';
    Chart.defaults.font.size = 14;
}

function get(url, fun, headers, body) {
    promises.push(fetch(url, {
        method: 'GET',
        headers: headers,
        body: body
    }).then(response => {
        if (!response.ok) {
            logout()
        }
        return response.json()
    }).then(data => {
        fun(data)
    }).catch(e => console.log(e)))
}

function logout() {
    localStorage.removeItem('token')
    window.location = "http://localhost:63342/el-frontend/plain/login.html";
}

function loadStationNames(stationNamesDto) {
    stationNamesDto.value.stationNames.forEach(x => {
        $('#stationNames').append($('<option>', {
            text: x,
            value: x
        }));
    })
    currentStationName = stationNamesDto.value.userStationName
    $('#stationNames').val(currentStationName)
    loadStatistics()
}

function loadStatistics() {
    currentDate = new Date($('#datePicker')[0].value)
    createNewLineChartData()
    fetchSendTimes()
    Promise.allSettled(promises).then(_ =>
    {
        generateChartColors()
        drawCharts()
    })
}

function createNewLineChartData() {
    temperatureDataPoints = [
        {
            name: 'KEPLERUHR',
            values: [{x: '1970-01-01 00:00:00', y: randomInteger(1, 40)}, {
                x: '1970-01-01 01:00:00',
                y: randomInteger(1, 40)
            }, {x: '1970-01-01 02:00:00', y: randomInteger(1, 40)}]
        },
        {
            name: 'Birkenau',
            values: [{x: '1970-01-01 00:00:00', y: randomInteger(1, 40)}, {
                x: '1970-01-01 01:00:00',
                y: randomInteger(1, 40)
            }, {x: '1970-01-01 02:00:00', y: randomInteger(1, 40)}]
        }
    ]
}

function fetchSendTimes() {
    const referenceDateTime = currentDate.toISOString().substring(0, 10)
    const clientDateTime = new Date().toISOString().substring(0, 19).replace('T', ' ')
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'referenceDateTime': `2022-07-28`,
        'clientDateTime': `${clientDateTime}`
    }
    get("http://localhost:7071/api/SendTimes", assignSendTimesDataPoints, headers)
}

function assignSendTimesDataPoints(sendTimes) {
    sendTimesDataPoints = sendTimes.result.value
    // generateChartColors()
    // drawCharts()
}

function generateChartColors() {
    const maxNumberOfStations = Math.max(sendTimesDataPoints.length, temperatureDataPoints.length)
    for (let i = 0; i < maxNumberOfStations; i++) {
        chartColors.push(randomRGBColor())
    }
}

function drawCharts() {
    temperatureChart = createTemperatureChart(temperatureDataPoints, "temperatureChart", "Temperaturverlauf", chartColors, "Temperatur")
    sendTimesChart = createBarChart(sendTimesDataPoints, "sendTimeChart", "Sendezeiten", chartColors)
}

function onStationChanged() {
    currentStationName = $('#stationNames').val()
    destroyCharts()
    drawCharts()
}


function destroyCharts()//while this is uglier and slower than updating the chart, once the user clicks on the label and thus hides/shows the chart, this state cannot be changed programmatically
{
    sendTimesChart.destroy()
    temperatureChart.destroy()
}

function onDateChanged() {
    const datePickerValue = $('#datePicker')[0].value
    if (datePickerValue !== "") {
        currentDate = new Date($('#datePicker')[0].value)
        changeChartData(temperatureChart, temperatureDataPoints, createNewLineChartData, lineChartForEachFunction)
        changeChartData(sendTimesChart, sendTimesDataPoints, createNewBarChartData, barChartForEachFunction)
    } else {
        if (new Date().toISOString().substring(0, 10) !== currentDate.toISOString().substring(0, 10)) {
            const newDate = new Date().toISOString().substring(0, 10)
            $('#datePicker')[0].value = newDate;
            currentDate = new Date($('#datePicker')[0].value)
            changeChartData(temperatureChart, temperatureDataPoints, createNewLineChartData, lineChartForEachFunction)
            changeChartData(sendTimesChart, sendTimesDataPoints, createNewBarChartData, barChartForEachFunction)
        } else {
            const newDate = new Date().toISOString().substring(0, 10)
            $('#datePicker')[0].value = newDate;
        }
    }
}

function changeChartData(chart, dataPoints, createNewDataFun, forEachFun) {
    const labels = [''];
    createNewDataFun()//what if this returns the data and asigns it to dataPoints?
    chart.data.datasets.forEach((dataset, index) => {
        forEachFun(dataset, index, dataPoints, labels)
    });
    chart.update();
}

function lineChartForEachFunction(dataset, index, dataPoints) {
    dataset.data = dataPoints[index].values
}

function barChartForEachFunction(dataset, index, dataPoints, labels) {
    dataset.data = labels.map(() => {
        return [(dataPoints[index].start - hourConverter) * millisConverter, (dataPoints[index].end - hourConverter) * millisConverter];
    })
}
