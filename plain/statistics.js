const HOUR_CONVERTER = 3600
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
let brightnessChart
let brightnessDataPoints
let promises = []

$(document).ready(function () {
    configureChartJSDefaults()
    loadCurrentDateIntoDatePicker()
    $('#stationNames').invisible()
    currentStationName = localStorage.getItem('station')
    loadStatistics()
})

function configureChartJSDefaults() {
    Chart.defaults.color = FONT_COLOR
    Chart.defaults.font.family = FONT_FAMILY
    Chart.defaults.font.size = FONT_SIZE
}

function loadCurrentDateIntoDatePicker() {
    $('#datePicker')[0].value = new Date().toISOString().substring(0, 10)
}

(function ($) {
    $.fn.invisible = function () {
        return this.each(function () {
            $(this).css("visibility", "hidden");
        });
    };
    $.fn.visible = function () {
        return this.each(function () {
            $(this).css("visibility", "visible");
        });
    };
}(jQuery));

function loadStatistics() {
    loadDatePickerValue()
    fetchStatistics()
    waitForPromises()
}

function loadDatePickerValue() {
    referenceDate = new Date($('#datePicker')[0].value)
}

function fetchStatistics() {
    fetchSendTimes()
    fetchTemperatureValues()
    fetchImagesPerHour()
    fetchBrightnessValues()
}

function fetchSendTimes() {
    get("https://earth-lat-1200.azurewebsites.net/api/SendTimes", assignSendTimesDataPoints, getHeaders())
}

function getHeaders() {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'referenceDateTime': `${getFormattedDate(referenceDate, false)}`,
        'timezoneOffset': `${getTimezoneOffset()}`,
        'x-functions-key': FUNCTIONS_KEY
    }
    return headers
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
        if (Math.floor(data.result.statusCode / 100) !== 2) {
            logout()
        }
        fun(data)
    }).catch(_ => logout()))
}

function logout() {
    localStorage.removeItem('token')
    window.location = "https://www.earthlat1200.org/mauseloch.html"
}

function assignSendTimesDataPoints(sendTimes) {
    if (sendTimes === undefined) {
        sendTimesDataPoints = []
        return
    }
    sendTimesDataPoints = sendTimes.result.value
    addStations(sendTimes.result.value)
}

function addStations(dataPoints) {
    if (dataPoints === undefined)
        return
    dataPoints.map(x => x.name).forEach(x => {
        stationNames.add(x)
    })
}

function fetchTemperatureValues() {
    get("https://earth-lat-1200.azurewebsites.net/api/TemperatureValues", assignTemperaturesDataPoints, getHeaders())
}

function assignTemperaturesDataPoints(temperatureValues) {
    if (temperatureValues === undefined) {
        temperatureDataPoints = []
        return
    }
    temperatureDataPoints = temperatureValues.result.value
    addStations(temperatureValues.result.value)
}


function fetchImagesPerHour() {
    get("https://earth-lat-1200.azurewebsites.net/api/ImagesPerHour", assignImagesPerHourDataPoints, getHeaders())
}

function assignImagesPerHourDataPoints(imagesPerHour) {
    if (imagesPerHour === undefined) {
        imagesPerHourDataPoints = []
        return
    }
    imagesPerHourDataPoints = imagesPerHour.result.value
    addStations(imagesPerHour.result.value)
}

function fetchBrightnessValues() {
    get("https://earth-lat-1200.azurewebsites.net/api/BrightnessValues", assignBrightnessDataPoints, getHeaders())
}

function assignBrightnessDataPoints(brightnessValues) {
    if (brightnessValues === undefined) {
        brightnessDataPoints = []
        return
    }
    brightnessDataPoints = brightnessValues.result.value
    addStations(brightnessValues.result.value)
}

function waitForPromises(fun) {
    Promise.allSettled(promises).then(p => {
        if (p.map(x => x.status).includes('rejected')) {
            alert('Some statistics could not be loaded')
        }
        generateChartColors()
        loadStations()
        if (typeof fun === 'function') {
            fun()
        }
        drawCharts()
    })
}

function generateChartColors() {
    const maxNumberOfStations = Math.max(sendTimesDataPoints.length, temperatureDataPoints.length, imagesPerHourDataPoints.length, brightnessDataPoints.length)
    for (let i = 0; i < maxNumberOfStations; i++) {
        chartColors.push(randomRGBColor())
    }
}

function loadStations() {
    stationNames.forEach(x => {
        $('#stationNames').append($('<option>', {
            text: x,
            value: x
        }))
    })
    $('#stationNames').val(currentStationName)
    if ($('#stationNames option').length > 0) {
        $("#stationNames").visible();
    }
}


function drawCharts() {
    sendTimesChart = createBarChart(sendTimesDataPoints, "sendTimeChart", "Sendezeiten")
    temperatureChart = createLineChart(temperatureDataPoints, "temperatureChart", "Temperaturverlauf", "Grad")
    imagesPerHourChart = createLineChart(imagesPerHourDataPoints, "imagesPerHourChart", "Upload-Aktivität", "Bilder pro Stunde")
    brightnessChart = createLineChart(brightnessDataPoints, "brightnessChart", "Helligkeitsverlauf", "Helligkeit")
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
    imagesPerHourChart.destroy()
    brightnessChart.destroy()
}

function onDateChanged() {
    stationNames = new Set()
    if ($('#datePicker')[0].value !== "") {
        fetchNewStatistics()
    } else {
        handleInvalidDate()
    }
}

function fetchNewStatistics() {
    referenceDate = new Date($('#datePicker')[0].value)
    fetchStatistics()
    unloadStationNames()
    waitForPromises(destroyCharts)
}

function unloadStationNames() {
    $('#stationNames option').each(function () {
        $(this).remove()
    })
}

function handleInvalidDate() {
    loadCurrentDateIntoDatePicker()
    if (new Date().toISOString().substring(0, 10) !== referenceDate.toISOString().substring(0, 10)) {
        fetchNewStatistics()
    }
}
