const hourOffset = 3600;
const millisConverter = 1000
let currentStationName
let currentDate
let sendTimeChart
let sendTimeDataPoints
let temperatureChart
let temperatureDataPoints

$(document).ready(function () {
    $('#datePicker')[0].value = new Date().toISOString().substring(0,10);
    get("http://localhost:7071/api/StationNames", loadStationNames);
});

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
    }).catch(_=>logout())
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

function loadStatistics(){
    currentDate = new Date($('#datePicker')[0].value)
    createNewLineChartData()
    createNewBarChartData()
    drawCharts()
    //createTemperatureChart(labels, datapoints,"brightnessChart")
    //createTemperatureChart(labels, datapoints,"uploadedPPMChart")
}

function createNewLineChartData(){
    temperatureDataPoints = [
        {
            name: 'KEPLERUHR',
            values:[{x:'1970-01-01 00:00:00',y:randomInteger(1,40)},{x:'1970-01-01 01:00:00',y:randomInteger(1,40)},{x:'1970-01-01 02:00:00',y:randomInteger(1,40)}]
        },
        {
            name: 'Birkenau',
            values:[{x:'1970-01-01 00:00:00',y:randomInteger(1,40)},{x:'1970-01-01 01:00:00',y:randomInteger(1,40)},{x:'1970-01-01 02:00:00',y:randomInteger(1,40)}]
        }
    ]
}

function createNewBarChartData() {
    sendTimeDataPoints = [{name:'KEPLERUHR',start:randomInteger(1,4)*hourOffset, end:randomInteger(12,16)*hourOffset},{name:'Birkenau',start: randomInteger(3,7)*hourOffset, end:randomInteger(18,22)*hourOffset}];
}

function drawCharts(){
    temperatureChart = createTemperatureChart(temperatureDataPoints,"temperatureChart")
    sendTimeChart = createSendTimeChart(sendTimeDataPoints)
}

function onStationChanged(){
    currentStationName = $('#stationNames').val()
    destroyCharts()
    drawCharts()
}


function destroyCharts()//while this is uglier and slower than updating the chart, once the user clicks on the label and thus hides/shows the chart, this state cannot be changed programmatically
{
    sendTimeChart.destroy()
    temperatureChart.destroy()
}

function onDateChanged() {
    currentDate = new Date($('#datePicker')[0].value)
    changeLineChartData(temperatureChart);
    changeBarChartData(sendTimeChart)
}

function changeLineChartData(chart){
    createNewLineChartData()
    chart.data.datasets.forEach((dataset, index) => {
        dataset.data=temperatureDataPoints[index].values
    });
    chart.update();
}

function changeBarChartData(chart)
{
    const labels = [''];
    createNewBarChartData()
    chart.data.datasets.forEach((dataset, index) => {
        dataset.data=labels.map(()=>{
            return [(sendTimeDataPoints[index].start-hourOffset)*millisConverter, (sendTimeDataPoints[index].end-hourOffset)*millisConverter];
        })
    });
    chart.update();
}
