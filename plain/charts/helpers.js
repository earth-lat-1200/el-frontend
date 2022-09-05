const tickConfig = {
    beginAtZero: true,
    callback: function (context,index) {
        if (context === '12PM' && index === 24-getTimezoneOffsetHours()) {
            return `noon today: ${context}`
        }
        return context
    },
    color: function (context) {
        if (context.index >= 12-getTimezoneOffsetHours() && context.index <= 36-getTimezoneOffsetHours()) {
            return HIGHLIGHTED_FONT_COLOR
        }
        return DEFAULT_FONT_COLOR
    }
}

const gridConfig = 'rgb(255, 255, 255, 0.4)'

function formatSeconds(seconds) {
    return new Date(MILLIS_CONVERTER * seconds).toISOString().substring(11, 16)
}

function randomRGBColor() {
    let r = randomInteger(127, 255);
    let g = randomInteger(127, 255);
    let b = randomInteger(127, 255);
    return [r, g, b];
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function formatChartDate(hour, day) {
    if (hour < 10) {
        return `1970-01-0${day} 0${hour}:00:00`
    }
    return `1970-01-0${day} ${hour}:00:00`
}

function getTimezoneOffset() {
    return -(new Date().getTimezoneOffset())
}

function getTimezoneOffsetHours() {
    return getTimezoneOffset() / 60
}

function getFormattedDate(date, local) {
    if (local) {
        date = new Date(date.getTime() + (getTimezoneOffset() * 60 * 1000))
    }
    return date.toISOString().split('T')[0]
}

function getFormattedTooltipDate(milliseconds) {
    const seconds = milliseconds / MILLIS_CONVERTER
    const timeString = formatSeconds(seconds + HOUR_CONVERTER)
    let date = new Date(getFormattedDate(referenceDate, false))
    date.setDate(date.getDate() - 1)
    date.setSeconds(date.getSeconds() + seconds - HOUR_CONVERTER)
    const dateString = getFormattedDate(date, true).replaceAll('-','/')
    return `${timeString} ${dateString}`
}
