let shownImage;
let globe;
const DEFAULT_LANDSCAPE_ALTITUDE = 2.5;
const DEFAULT_PORTRAIT_ALTITUDE = 3;
const MINIMUM_ALTITUDE = 4;

function triggerResize() {
    window.dispatchEvent(new Event('resize'));
}

document.addEventListener("DOMContentLoaded", function () {
    fetch('./example_places.geojson').then(res => res.json()).then(places => {


        const arcsData = [
            {
                startLat: 0,
                startLng: 0,
                endLat: 90,
                endLng: 0,
                color: 'red'
            },
            {
                startLat: 0,
                startLng: 0,
                endLat: -90,
                endLng: 0,
                color: 'red'
            }
        ];

        let zoom = {altitude: 2.5};
        globe = Globe()
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
            .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
            .width(calcWidth())
            .height(window.innerHeight)
            .labelsData(places.features)
            .labelLat(d => d.properties.latitude)
            .labelLng(d => d.properties.longitude)
            .labelText(d => d.properties.name)
            .labelSize(d => Math.sqrt(d.properties.pop_max) * 4e-4)
            .labelDotRadius(d => Math.sqrt(d.properties.pop_max) * 4e-4)
            .labelColor(() => 'rgba(255, 165, 0, 0.75)')
            .labelResolution(2)
            .arcsData(arcsData)
            .arcColor('color')
            .arcAltitude(0)
            .arcStroke(1)
            // .arcDashLength(() => Math.random())
            .arcDashGap(0)
            .showAtmosphere(true)
            (document.getElementById('globe'))

        globe.onLabelClick((label, event) => {
            loadImage();
        })
        globe.onZoom(v => {
            zoom = v;
        })
        setGlobePOV();
    });
})

function calcWidth() {
    return window.innerWidth * 1.35;
}

function calcHeight() {
    const stationEl = document.getElementById('station');
    let screenOccupy = stationEl.offsetHeight / window.innerHeight;
    let multiplier = screenOccupy === 0 ? 1 : 1 - screenOccupy;

    return window.innerHeight * multiplier;
}

loadImage = () => {
    const imgEl = document.getElementById('station-image');
    const divEl = document.getElementById('station');
    fetch('./example_station.png').then(res => res.blob()).then(resImg => {
        shownImage = URL.createObjectURL(resImg);
        imgEl.src = shownImage;
        divEl.style.display = 'block';
        imgEl.style.objectFit = 'contain';
        // UGLY solution, couldn't find an alternative yet
        setTimeout(function () {
            triggerResize();
            triggerResize();
            triggerResize();
        }, 100);
    });
}

function setGlobePOV() {
    var lat = 10;
    var lng = 25;
    globe.height(window.innerHeight);
    let altitude;
    if (window.innerWidth > window.innerHeight) // landscape
    {
        resizeStationInfoLandscape();
        globe.height(window.innerHeight);
        globe.width(calcWidth());
        altitude = DEFAULT_LANDSCAPE_ALTITUDE;
    } else { // portrait
        resizeStationInfoPortrait();
        globe.height(calcHeight());
        globe.width(window.innerWidth);
        altitude = window.innerWidth < 550 ? MINIMUM_ALTITUDE : DEFAULT_PORTRAIT_ALTITUDE;
    }
    globe.pointOfView({lat, lng, altitude: altitude});
}

resizeStationInfoPortrait = () => {
    const stationEl = document.getElementById('station');
    const stationWidth = stationEl.offsetWidth;
    stationEl.style.left = `${(window.innerWidth - stationWidth) / 2}px`;
    stationEl.style.top = 'auto';
    stationEl.style.bottom = '5px';
}

resizeStationInfoLandscape = () => {
    const stationEl = document.getElementById('station');
    stationEl.style.left = `10vw`;
    stationEl.style.top = '50%';
    stationEl.style.bottom = 'auto';
}

onClickClose = () => {
    const overlays = document.getElementsByClassName('image-overlay');
    while (overlays.length > 0) {
        overlays[0].classList.add('image-overlay-off');
        overlays[0].classList.remove('image-overlay');
    }
}

showStationData = () => {
    const overlays = document.getElementsByClassName('image-overlay-off');
    while (overlays.length > 0) {
        overlays[0].classList.add('image-overlay');
        overlays[0].classList.remove('image-overlay-off');
    }
}

window.addEventListener('resize', (event) => {
    setGlobePOV();
});
