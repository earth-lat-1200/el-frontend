const FUNCTIONS_KEY = 'oH/GOJSarf1jT1LutARtm4aOhJWOgELdw3Nka1DkX6mDE2B6l93uuA==';
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
let sendTimesDataPoints = []
let temperatureChart
let temperatureDataPoints = []
let imagesPerHourChart
let imagesPerHourDataPoints = []
let brightnessChart
let brightnessDataPoints = []
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
    get("https://earth-lat-1200.azurewebsites.net/api/SendTimes", createSendTimesChart, getHeaders())
}

function getHeaders() {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'referenceDateTime': `${getFormattedDate(referenceDate, false)}`,
        'timezoneOffset': `${getTimezoneOffset()}`,
        'x-functions-key': `${FUNCTIONS_KEY}`
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

function createSendTimesChart(sendTimes) {
    if (sendTimes === undefined) {
        sendTimesDataPoints = []
    } else {
        sendTimesDataPoints = sendTimes.result.value
    }
    addStations(sendTimesDataPoints)
    generateRequiredChartColors()
    sendTimesChart = createBarChart(sendTimesDataPoints, "sendTimeChart", "Sendezeiten")
}

function addStations(dataPoints) {
    if (dataPoints === undefined)
        return
    dataPoints.map(x => x.name).forEach(x => {
        stationNames.add(x)
    })
}

function fetchTemperatureValues() {
    get("https://earth-lat-1200.azurewebsites.net/api/TemperatureValues", createTemperaturesChart, getHeaders())
}

function createTemperaturesChart(temperatureValues) {
    if (temperatureValues === undefined) {
        temperatureDataPoints = []
    } else {
        temperatureDataPoints = temperatureValues.result.value
    }
    addStations(temperatureDataPoints)
    generateRequiredChartColors()
    temperatureChart = createLineChart(temperatureDataPoints, "temperatureChart", "Temperaturverlauf", "C°")
}


function fetchImagesPerHour() {
    get("https://earth-lat-1200.azurewebsites.net/api/ImagesPerHour", createImagesPerHourChart, getHeaders())
}

function createImagesPerHourChart(imagesPerHour) {
    if (imagesPerHour === undefined) {
        imagesPerHourDataPoints = []
    } else {
        imagesPerHourDataPoints = imagesPerHour.result.value
    }
    addStations(imagesPerHourDataPoints)
    generateRequiredChartColors()
    imagesPerHourChart = createLineChart(imagesPerHourDataPoints, "imagesPerHourChart", "Upload-Aktivität", "Bilder pro Stunde")
}

function fetchBrightnessValues() {
    get("https://earth-lat-1200.azurewebsites.net/api/BrightnessValues", createBrightnessChart, getHeaders())
}

function createBrightnessChart(brightnessValues) {
    if (brightnessValues === undefined) {
        brightnessDataPoints = []
    } else {
        brightnessDataPoints = brightnessValues.result.value
    }
    addStations(brightnessDataPoints)
    generateRequiredChartColors()
    brightnessChart = createLineChart(brightnessDataPoints, "brightnessChart", "Helligkeitsverlauf", "Helligkeit")
}

function waitForPromises() {
    Promise.allSettled(promises).then(p => {
        if (p.map(x => x.status).includes('rejected')) {
            alert('Some statistics could not be loaded')
        }
        loadStationNames()
        promises = []
    })
}

function generateRequiredChartColors() {
    const maxNumberOfStations = Math.max(sendTimesDataPoints.length, temperatureDataPoints.length, imagesPerHourDataPoints.length, brightnessDataPoints.length)
    for (let i = chartColors.length; i < maxNumberOfStations; i++) {
        chartColors.push(randomRGBColor())
    }
}

function loadStationNames() {
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
    destroyCharts()
    $('#stationNames').invisible()
    unloadStationNames()
    fetchStatistics()
    waitForPromises()
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
