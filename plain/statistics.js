const HOUR_CONVERTER = 3600;
const MILLIS_CONVERTER = 1000
const FONT_COLOR = '#ffffff'
const FONT_FAMILY = 'Rubik'
const FONT_SIZE = 14

let stationNames = new Set()
let currentStationName
let referenceDate
let chartColors = []
let sendTimesChart
let sendTimesDataPoints
let temperatureChart
let temperatureDataPoints
let imagesPerHourChart
let imagesPerHourDataPoints
let promises = []

$(document).ready(function () {
    configureChartJSDefaults()
    loadCurrentDateIntoDatePicker()
    currentStationName = localStorage.getItem('station')
    loadStatistics()
});

function configureChartJSDefaults() {
    Chart.defaults.color = FONT_COLOR;
    Chart.defaults.font.family = FONT_FAMILY;
    Chart.defaults.font.size = FONT_SIZE;
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

function loadStatistics() {
    loadDatePickerValue()
    fetchStatistics()
    waitForPromises()
}

function loadDatePickerValue() {
    referenceDate = new Date($('#datePicker')[0].value)
}

function fetchStatistics() {
    fetchImagesPerHour()
    fetchSendTimes()
}

function fetchImagesPerHour() {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'referenceDateTime': `${getFormattedReferenceDate()}`,
        'timezoneOffset': `${new Date().getTimezoneOffset()}`
    }
    get("http://localhost:7071/api/ImagesPerHour", assignImagesPerHourDataPoints, headers)
}

function getFormattedReferenceDate() {
    return referenceDate.toISOString().substring(0, 10)
}

function assignImagesPerHourDataPoints(imagesPerHour) {
    imagesPerHourDataPoints = imagesPerHour.result.value
    addStations(imagesPerHour.result.value)
}

function addStations(dataPoints){
    dataPoints.map(x => x.name).forEach(x => {
        stationNames.add(x)
    })
}

function fetchSendTimes() {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'referenceDateTime': `${getFormattedReferenceDate()}`,
        'timezoneOffset': `${new Date().getTimezoneOffset()}`
    }
    get("http://localhost:7071/api/SendTimes", assignSendTimesDataPoints, headers)
}

function assignSendTimesDataPoints(sendTimes) {
    sendTimesDataPoints = sendTimes.result.value
    addStations(sendTimes.result.value)
}

function waitForPromises(fun) {
    Promise.allSettled(promises).then(_ => {
        generateChartColors()
        loadStations()
        if(typeof fun === 'function') {
            fun()
        }
        drawCharts()
    })
}

function generateChartColors() {
    const maxNumberOfStations = Math.max(sendTimesDataPoints.length, imagesPerHourDataPoints.length)
    for (let i = 0; i < maxNumberOfStations; i++) {
        chartColors.push(randomRGBColor())
    }
}

function loadStations() {
    stationNames.forEach(x => {
        $('#stationNames').append($('<option>', {
            text: x,
            value: x
        }));
    })
    $('#stationNames').val(currentStationName)
}

function drawCharts() {
    sendTimesChart = createBarChart(sendTimesDataPoints, "sendTimeChart", "Sendezeiten")
    imagesPerHourChart = createLineChart(imagesPerHourDataPoints, "imagesPerHourChart", "Helligkeitswerte","Helligkeit")
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
    stationNames = new Set()
    if ($('#datePicker')[0].value !== "") {
        fetchNewStatistics()
    } else {
        handleInvalidDate()
    }
}


function handleInvalidDate() {
    loadCurrentDateIntoDatePicker()
    if (new Date().toISOString().substring(0, 10) !== referenceDate.toISOString().substring(0, 10)) {
        fetchNewStatistics()
    }
}

function loadCurrentDateIntoDatePicker() {
    $('#datePicker')[0].value = new Date().toISOString().substring(0, 10)
}

function fetchNewStatistics() {
    referenceDate = new Date($('#datePicker')[0].value)
    fetchStatistics()
    unloadStationNames()
    waitForPromises(destroyCharts)
}

function unloadStationNames() {
    $('#stationNames option').each(function () {
        $(this).remove();
    });
}
