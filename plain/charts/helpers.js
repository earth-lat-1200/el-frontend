function formatSeconds(seconds){
    return new Date(MILLIS_CONVERTER * seconds).toISOString().substring(11,16)
}

function randomRGBColor() {
    let r = randomInteger(127,255);
    let g = randomInteger(127,255);
    let b = randomInteger(127,255);
    return [r,g,b];
}

function randomInteger(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min);
}

function formatChartDate(index){
    if(index < 10)
    {
        return `1970-01-01 0${index}:00:00`
    }
    return `1970-01-01 ${index}:00:00`
}
