const tickConfig = {
    beginAtZero: true,
    color: function (context) {
        if (context.index === 12) {
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

function getStartDate() {
    const formattedDate = referenceDate.toISOString().split('T')[0]
    return `${formattedDate} 00:00:00`
}

function getEndDate(){
    const endDate = new Date()
    endDate.setDate(referenceDate.getDate()+1)
    const formattedDate = endDate.toISOString().split('T')[0]
    return `${formattedDate} 00:00:00`
}

function getFormattedDate(date) {
    return date.toISOString().split('T')[0]
}

function getTimeFromDate(date)
{
    return date.split(' ')[1]
}