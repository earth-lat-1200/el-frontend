const hourOffset = 3600;
const millisConverter = 1000

let currentStationName
let currentDate
let chartColors = []
let sendTimesChart
let sendTimesDataPoints
let temperatureChart
let temperatureDataPoints

$(document).ready(function () {
    configureChartJSDefaults()
    $('#datePicker')[0].value = new Date().toISOString().substring(0, 10);
    get("http://localhost:7071/api/StationNames", loadStationNames);
});

function configureChartJSDefaults() {
    Chart.defaults.color = "#ffffff";
    Chart.defaults.font.family = 'Rubik';
    Chart.defaults.font.size = 14;
}

function get(url, fun) {
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(response => {
        if (!response.ok) {
            logout()
        }
        return response.json()
    }).then(data => {
        fun(data.value)
    }).catch(_ => logout())
}

function logout() {
    localStorage.removeItem('token')
    window.location = "http://localhost:63342/el-frontend/plain/login.html";
}

function loadStationNames(stationNamesDto) {
    stationNamesDto.stationNames.forEach(x => {
        $('#stationNames').append($('<option>', {
            text: x,
            value: x
        }));
    })
    currentStationName = stationNamesDto.userStationName
    $('#stationNames').val(currentStationName)
    loadStatistics()
}

function loadStatistics() {
    currentDate = new Date($('#datePicker')[0].value)
    createNewLineChartData()
    createNewBarChartData()
    generateChartColors()
    drawCharts()
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

function createNewBarChartData() {
    sendTimesDataPoints = [{
        name: 'KEPLERUHR',
        start: randomInteger(1, 4) * hourOffset,
        end: randomInteger(12, 16) * hourOffset
    }, {name: 'Birkenau', start: randomInteger(3, 7) * hourOffset, end: randomInteger(18, 22) * hourOffset}];
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
    currentDate = new Date($('#datePicker')[0].value)
    changeChartData(temperatureChart, temperatureDataPoints, createNewLineChartData, lineChartForEachFunction)
    changeChartData(sendTimesChart, sendTimesDataPoints, createNewBarChartData, barChartForEachFunction)
}

function changeChartData(chart, dataPoints, createNewDataFun, forEachFun) {
    const labels = [''];
    createNewDataFun()
    chart.data.datasets.forEach((dataset, index) => {
        forEachFun(dataset, index, dataPoints ,labels)
    });
    chart.update();
}

function lineChartForEachFunction(dataset, index, dataPoints) {
    dataset.data = dataPoints[index].values
}

function barChartForEachFunction(dataset, index, dataPoints, labels) {
    dataset.data = labels.map(() => {
        return [(dataPoints[index].start - hourOffset) * millisConverter, (dataPoints[index].end - hourOffset) * millisConverter];
    })
}
