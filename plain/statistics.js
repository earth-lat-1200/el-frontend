const FUNCTIONS_KEY = 'oH/GOJSarf1jT1LutARtm4aOhJWOgELdw3Nka1DkX6mDE2B6l93uuA==';
const BASE_API_URL = "https://earth-lat-1200.azurewebsites.net/api/"
const HOUR_CONVERTER = 3600
const MILLIS_CONVERTER = 1000
const DEFAULT_FONT_COLOR = '#ffffff'
const HIGHLIGHTED_FONT_COLOR = '#99ff99'
const FONT_FAMILY = 'Rubik'
const FONT_SIZE = 14
const FONT_SIZE_TITLE = 28
const FONT_SIZE_LABEL = 20
const START_STATION = '*'
const LINE_CHART_START = 0
const NORMAL_LINE_CHART_END = 100
const BRIGHTNESS_LINE_CHART_END = 5000000
const BAR_CHART_TYPE = "bar"
const LINE_CHART_TYPE = "line"

let invoke = true
let stationNames = new Set(START_STATION)
let currentStationName
let referenceDate
let chartColors = []
let promises = []
let statisticInfo = []

$(document).ready(function () {
    configureChartJSDefaults()
    loadCurrentDateIntoDatePicker()
    $('#stationNames').invisible()
    currentStationName = START_STATION
    initStatisticInfo()
    loadStatistics()
})

function configureChartJSDefaults() {
    Chart.defaults.color = DEFAULT_FONT_COLOR
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

function initStatisticInfo() {
    statisticInfo.push(new StatisticInfo("SendTimes", "sendTimeChart", BAR_CHART_TYPE))
    statisticInfo.push(new StatisticInfo("TemperatureValues", "temperatureChart", LINE_CHART_TYPE))
    statisticInfo.push(new StatisticInfo("ImagesPerHour", "imagesPerHourChart", LINE_CHART_TYPE))
    statisticInfo.push(new StatisticInfo("BrightnessValues", "brightnessChart", LINE_CHART_TYPE))
}

function loadStatistics() {
    loadDatePickerValue()
    fetchStatistics(createChart, true)
    waitForPromises()
}

function loadDatePickerValue() {
    referenceDate = new Date($('#datePicker')[0].value)
}

function fetchStatistics(fun, addToPromises, updateHidden) {
    statisticInfo.forEach(s => {
        get(s, fun, addToPromises, updateHidden)
    })
}


function getHeaders() {
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
        'referenceDate': `${getFormattedDate(referenceDate, false)}`,
        'timezoneOffset': `${getTimezoneOffset()}`,
        'x-functions-key': `${FUNCTIONS_KEY}`
    }
    return headers
}

function get(statisticInfo, fun, addToPromises, updateHidden) {
    promises.push(fetch(BASE_API_URL + statisticInfo.url, {
        method: 'GET',
        headers: getHeaders(),
    }).then(response => {
        if (!response.ok) {
            console.log('not ok')
            // logout()
        }
        return response.json()
    }).then(data => {
        if (Math.floor(data.result.statusCode / 100) !== 2) {
            console.log('not 200')
            //logout()
        }
        fun(statisticInfo, data, updateHidden)
    }).catch(e => console.log(e)
    ).finally(_ => {
        if (!addToPromises) {
            promises.pop()
        }
    }))
}

function logout() {
    localStorage.removeItem('token')
    window.location = "http://localhost:63342/el-frontend/plain/mauseloch.html"
}

function createChart(statisticInfo, data) {
    generateRequiredChartColors(data.result.value.length)
    addStations(data.result.value)
    switch (statisticInfo.chartType) {
        case BAR_CHART_TYPE:
            statisticInfo.chart = createBarChart(data.result.value, statisticInfo.canvasName, "Broadcast times")//TODO title should be dynamically parsed by the backend
            break
        case LINE_CHART_TYPE:
            statisticInfo.chart = createLineChart(data.result.value, statisticInfo.canvasName, "Line chart", "", 0, 100)//TODO same here + desc and y-Axis boundaries
            break
        default:
            break
    }
}

function addStations(dataPoints) {
    if (dataPoints === undefined)
        return
    dataPoints.map(x => x.name).forEach(x => {
        stationNames.add(x)
    })
}

function generateRequiredChartColors(dataLength) {
    for (let i = chartColors.length; i < dataLength; i++) {
        chartColors.push(randomRGBColor())
    }
}

function waitForPromises() {
    Promise.allSettled(promises).then(p => {
        if (p.map(x => x.status).includes('rejected')) {
            alert('Some statistics could not be loaded')
        }
        loadStationNames()
        promises = []
        setTimeout(function () {
            fetchStatistics(updateChart, false)
        }, 5000)
    })
}

function loadStationNames() {
    stationNames.forEach(x => {
        $('#stationNames').append($('<option>', {
            text: x,
            value: x
        }))
    })
    $('#stationNames').val(currentStationName)
    if ($('#stationNames option').length > 2) {
        $("#stationNames").visible();
    }
}

function onStationChanged() {
    currentStationName = $('#stationNames').val()
    fetchStatistics(updateChart, false, true)
}

function updateChart(statisticInfo, data, updateHidden) {
    switch (statisticInfo.chartType) {
        case BAR_CHART_TYPE:
            statisticInfo.chart.data.datasets.forEach((dataset, index) => {
                if (updateHidden) {
                    let meta = statisticInfo.chart.getDatasetMeta(index)
                    meta.hidden = (dataset.label !== currentStationName) && (currentStationName !== '*')
                }
                const newStart = ((data.result.value[index].start - HOUR_CONVERTER) * MILLIS_CONVERTER)
                const newEnd = ((data.result.value[index].end - HOUR_CONVERTER) * MILLIS_CONVERTER)
                if (newStart !== undefined && newStart != null) {
                    dataset.data[0][0] = newStart
                }
                if (newEnd !== undefined && newEnd != null) {
                    dataset.data[0][1] = newEnd
                }
            })
            break
        case LINE_CHART_TYPE:
            statisticInfo.chart.data.datasets.forEach((dataset, outerIndex) => {
                if (updateHidden) {
                    let meta = statisticInfo.chart.getDatasetMeta(outerIndex)
                    meta.hidden = (dataset.label !== currentStationName) && (currentStationName !== '*')
                }
                dataset.data.forEach((dataPoint, innerIndex) => {
                    const newDataPoint = Math.round((data.result.value[outerIndex].values[innerIndex]) * 100) / 100
                    if (newDataPoint !== undefined && newDataPoint != null) {
                        dataPoint.y = newDataPoint
                    }
                })
            })
            break
        default:
            break
    }
    statisticInfo.chart.update()

    if (invoke) {
        invoke = false
        setInterval(function () {
            fetchStatistics(updateChart, false)
        }, 5000)
    }
}

function onDateChanged() {
    stationNames = new Set(START_STATION)
    if ($('#datePicker')[0].value !== "") {
        fetchStatisticsForNewDate()
    } else {
        handleInvalidDate()
    }
}

function fetchStatisticsForNewDate() {
    referenceDate = new Date($('#datePicker')[0].value)
    destroyCharts()
    $('#stationNames').invisible()
    unloadStationNames()
    fetchStatistics(createChart, true)
    waitForPromises()
}

/*
    while this is uglier and slower than updating the chart,
    once the user clicks on the label and thus hides/shows the chart,
    this state cannot be changed programmatically.
    For that reason the charts are destroyed and recreated.
*/
function destroyCharts() {
    statisticInfo.forEach(s => {
        s.chart.destroy()
    })
}

function unloadStationNames() {
    $('#stationNames option').each(function () {
        $(this).remove()
    })
}

function handleInvalidDate() {
    loadCurrentDateIntoDatePicker()
    if (new Date().toISOString().substring(0, 10) !== referenceDate.toISOString().substring(0, 10)) {
        fetchStatisticsForNewDate()
    }
}

class StatisticInfo {
    constructor(url, canvasName, chartType) {
        this.url = url;
        this.canvasName = canvasName;
        this.chartType = chartType;
        this.chart = {};
    }
}
