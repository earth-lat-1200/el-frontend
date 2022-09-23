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
const NORMAL_LINE_CHART_END = 100
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
    statisticInfo.push(new StatisticInfo("BroadcastTimes", "sendTimeChart"))
    statisticInfo.push(new StatisticInfo("TemperatureValues", "temperatureChart"))
    statisticInfo.push(new StatisticInfo("ImagesPerHour", "imagesPerHourChart"))
    statisticInfo.push(new StatisticInfo("BrightnessValues", "brightnessChart"))
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

function createChart(statisticInfo, data) {
    generateRequiredChartColors(data.result.value.datasets.length)
    addStations(data.result.value.datasets)
    switch (data.result.value.chartType) {
        case BAR_CHART_TYPE:
            statisticInfo.chart = createBarChart(data.result.value.datasets, statisticInfo.canvasName, data.result.value.chartTitle)
            statisticInfo.chartType = BAR_CHART_TYPE
            break
        case LINE_CHART_TYPE:
            statisticInfo.chart = createLineChart(data.result.value.datasets, statisticInfo.canvasName, data.result.value.chartTitle, data.result.value.description, data.result.value.min, data.result.value.max)
            statisticInfo.chartType = LINE_CHART_TYPE
            break
        default:
            break
    }
}

function generateRequiredChartColors(dataLength) {
    for (let i = chartColors.length; i < dataLength; i++) {
        chartColors.push(randomRGBColor())
    }
}

function addStations(dataPoints) {
    if (dataPoints === undefined)
        return
    dataPoints.map(x => x.name).forEach(x => {
        stationNames.add(x)
    })
}

function get(statisticInfo, fun, addToPromises, updateHidden) {
    promises.push(fetch(BASE_API_URL + statisticInfo.url, {
        method: 'GET',
        headers: getHeaders(),
    }).then(response => {
        if (!response.ok) {
            logout()
        }
        return response.json()
    }).then(data => {
        if (Math.floor(data.result.statusCode / 100) !== 2) {
            logout()
        }
        fun(statisticInfo, data, updateHidden)
    }).catch(_ => logout()
    ).finally(_ => {
        if (!addToPromises) {
            promises.pop()
        }
    }))
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

function logout() {
    localStorage.removeItem('token')
    window.location = "https://www.earthlat1200.org/mauseloch.html"
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
    if (!stationNames.has(currentStationName)) {
        currentStationName = START_STATION
        updateStatisticInfoVisibility()
    }
    $('#stationNames').val(currentStationName)
    if ($('#stationNames option').length > 2) {
        $("#stationNames").visible();
    }
}

function updateStatisticInfoVisibility() {
    statisticInfo.forEach(s => {
        updateChart(s, undefined, true)
    })
}

function updateChart(statisticInfo, data, updateHidden) {
    switch (statisticInfo.chartType) {
        case BAR_CHART_TYPE:
            statisticInfo.chart.data.datasets.forEach((dataset, index) => {
                if (updateHidden) {
                    updateDatasetVisibility(statisticInfo, index, dataset)
                }
                if (data !== undefined) {
                    updateBarChartDataset(data, index, dataset)
                }
            })
            break
        case LINE_CHART_TYPE:
            statisticInfo.chart.data.datasets.forEach((dataset, outerIndex) => {
                if (updateHidden) {
                    updateDatasetVisibility(statisticInfo, outerIndex, dataset)
                }
                if (data !== undefined) {
                    updateLineChartDataset(data, outerIndex, dataset)
                }
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

function updateDatasetVisibility(statisticInfo, index, dataset) {
    let meta = statisticInfo.chart.getDatasetMeta(index)
    meta.hidden = (dataset.label !== currentStationName) && (currentStationName !== '*')
}

function updateBarChartDataset(data, index, dataset) {
    const newStart = ((data.result.value.datasets[index].start - HOUR_CONVERTER) * MILLIS_CONVERTER)
    const newEnd = ((data.result.value.datasets[index].end - HOUR_CONVERTER) * MILLIS_CONVERTER)
    if (newStart !== undefined && newStart != null) {
        dataset.data[0][0] = newStart
    }
    if (newEnd !== undefined && newEnd != null) {
        dataset.data[0][1] = newEnd
    }
}

function updateLineChartDataset(data, outerIndex, dataset) {
    dataset.data.forEach((dataPoint, innerIndex) => {
        const newDataPoint = Math.round((data.result.value.datasets[outerIndex].values[innerIndex]) * 100) / 100
        if (newDataPoint !== undefined && newDataPoint != null) {
            dataPoint.y = newDataPoint
        }
    })
}

function onStationChanged() {
    currentStationName = $('#stationNames').val()
    updateStatisticInfoVisibility()
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

//redrawing the charts for different dates is easier than checking for and adding/removing new/existing stations
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
    constructor(url, canvasName) {
        this.url = url;
        this.canvasName = canvasName;
        this.chart = {};
        this.chartType = ''
    }
}
