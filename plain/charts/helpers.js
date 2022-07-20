function formatSeconds(seconds){
    return new Date(millisConverter * seconds).toISOString().substring(11,16)
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
