const tickConfig = {
    beginAtZero: true,
    color: function (context) {
        if (context.index % 12 === 0 && context.index % 24 !== 0) {
            return HIGHLIGHTED_FONT_COLOR
        }
        return DEFAULT_FONT_COLOR
    }
}

const gridConfig = 'rgb(255, 255, 255, 0.4)'

function randomRGBColor() {
    let r = randomInteger(127, 255);
    let g = randomInteger(127, 255);
    let b = randomInteger(127, 255);
    return [r, g, b];
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getFormattedDateTime(date) {
    const formattedDate = date.toISOString().split('T')[0]
    return `${formattedDate} 00:00:00`
}

function getFormattedDate(date) {
    return date.toISOString().split('T')[0]
}

function getDateFromDate(date) {
    return date.split(' ')[0]
}

function getTimeFromDate(date) {
    return date.split(' ')[1]
}