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
        let onInit = true;
        let lng = 0;
        let zoom = { altitude: 2.5 };

        const globe = Globe()
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
            .showAtmosphere(true)
            (document.getElementById('globe'))

        globe.onLabelClick((label, event) => {
            loadImage();
        })
        globe.onZoom(v => {
            zoom = v;
        })
        
        function refresh() {
            lng = calcNoonMeridian();        
      
            const arcsData = [
                {
                    startLat: 0,
                    startLng: lng,
                    endLat: 90,
                    endLng: lng,
                    color: 'red'
                },
                {
                    startLat: 0,
                    startLng: lng,
                    endLat: -90,
                    endLng: lng,
                    color: 'red'
                }
            ];
        
            globe
            .arcsData(arcsData)
            .arcColor('color')
            .arcAltitude(0)
            .arcStroke(0.25)
            .arcDashGap(0)    
                   
            console.log(lng);
            setTimeout(refresh, 5000);
        }
        
        refresh();

        if(onInit) {
            globe.pointOfView({ lat: 0, lng: lng+10, altitude: zoom.altitude }, 1000)
            onInit = false;
        }

        setGlobePOV();
    });
    
})



function calcNoonMeridian() {
    var nowUtc = moment().utc();

    let timeEquation = calcTimeEquation(nowUtc.dayOfYear()); 

    let currTimeinH = nowUtc.hour() + nowUtc.minute() / 60 + nowUtc.second() / 3600 ;

    let long = (-180/12) * (currTimeinH + timeEquation - 12);

    return long;
}

function calcTimeEquation(currDay) {
    let teq = (-0.171)*Math.sin(0.0337 * currDay + 0.465) - 0.1299*Math.sin(0.01787 * currDay - 0.168);
    return teq
}

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
