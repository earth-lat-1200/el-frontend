const DEFAULT_LANDSCAPE_ALTITUDE = 2.5;
const DEFAULT_PORTRAIT_ALTITUDE = 3.2;
const LANDSCAPE_WIDTH_SIZE = 821;
const FUNCTIONS_KEY = 'oH/GOJSarf1jT1LutARtm4aOhJWOgELdw3Nka1DkX6mDE2B6l93uuA==';
const MAX_LNG_OFFSET = 180;

let globe = {};
let lng = 0;
let stations = [];
let activeStation = {};

document.addEventListener("DOMContentLoaded", function () {
    getStations().then(() => {
        activeStation = stations[0]
        setClosestStation()
        createGlobe()
        loadImage();

        function refresh() {
            lng = calcNoonMeridian()
            let arcData = getArcData()
            drawArcOnGlobe(arcData)
            setTimeout(refresh, 5000);
        }

        refresh();
        setGlobePOV();
    })
})

function getStations() {
    return fetch("https://earth-lat-1200.azurewebsites.net/api/GetAllStations", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-functions-key': FUNCTIONS_KEY
        }
    }).then(res => res.json()).then(s => {
        stations = s.result.value;
    })
}

function setClosestStation() {
    lng = calcNoonMeridian();
    activeStation = stations[0]
    for (const station of stations) {
        let offset = MAX_LNG_OFFSET - Math.abs(station.longitude - lng)
        let activeOffset = MAX_LNG_OFFSET - Math.abs(activeStation.longitude - lng)
        if (offset > activeOffset) {
            activeStation = station
        }
    }
}

function calcNoonMeridian() {
    let nowUtc = moment().utc();
    let seconds = (nowUtc.hour()) * 60 * 60 + nowUtc.minute() * 60 + nowUtc.second();
    let long = -1 * ((seconds / 240) - MAX_LNG_OFFSET)
    return long;
}

function createGlobe() {
    let gData = getMarkerData(stations);
    globe = Globe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
        .width(calcWidth())
        .height(window.innerHeight)
        .showAtmosphere(true)
        .htmlElementsData(gData)
        .htmlElement(d => {
            return drawMarker(d)
        })
        (document.getElementById('globe'))
}

function getMarkerData(stations) {
    let index = 0;
    return stations
        .filter(station => station.latitude !== 0 && station.longitude !== 0)
        .map(station => {
            return {
                id: index++,
                stationId: station.stationId,
                name: station.stationName,
                location: station.location,
                lat: station.latitude,
                lng: station.longitude,
                size: 20,
                color: 'red'
            };
        });
}

function calcWidth() {
    return window.innerWidth * 1.35;
}

function drawMarker(d) {
    const el = document.createElement('img');
    if (d.stationId === activeStation.stationId) {
        el.src = './resources/marker_red.svg';
        el.style.opacity = 0.8;
    } else {
        el.src = './resources/marker_white.svg';
        el.style.opacity = 0.5;
    }
    el.style.width = `${d.size}px`;
    el.id = d.stationId;
    el.className = "stationIcon"
    el.style['pointer-events'] = 'auto';
    el.style.cursor = 'pointer';
    el.onclick = () => {
        activeStation = stations[d.id];
        loadImage();
        const stationIcons = document.getElementsByClassName("stationIcon");
        for (let stationIcon of stationIcons) {
            stationIcon.src = './resources/marker_white.svg';
            stationIcon.style.opacity = 0.5;
        }
        el.src = './resources/marker_red.svg';
        el.style.opacity = 0.8;
    };
    return el;
}

loadImage = () => {
    const imgEl = document.getElementById('station-image');
    const divEl = document.getElementById('station');
    getStationPicture()
        .then(resImg => {
            imgEl.setAttribute(
                'src', resImg
            );
            imgEl.style.objectFit = 'contain';
            updateActiveStationData();
            divEl.style.display = 'block';
            // UGLY solution, couldn't find an alternative yet
            setTimeout(function () {
                setGlobePOV(true);
                setGlobePOV(true);
                setGlobePOV(true);
            }, 100);
        });
}

function getStationPicture() {
    const stationId = activeStation.stationId;
    return fetch(`https://earth-lat-1200.azurewebsites.net/api/GetLatestTotalImageById?id=${stationId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-functions-key': FUNCTIONS_KEY
        }
    }).then(res => res.json()).then(res => {
        return 'data:image/jpeg;base64,' + res.result.value
    })
}

updateActiveStationData = () => {
    let stationInfoLabelEl = document.getElementById("station-info-label");
    stationInfoLabelEl.innerHTML = `${activeStation.stationName} - ${activeStation.location}  <a><i id="info-btn" onclick="showStationData()"
    class="icon ion-md-information-circle"></i></a>`;
    let stationLocationEl = document.getElementById("station-location");
    stationLocationEl.innerHTML = `Location: ${activeStation.location}`;
    let stationWebcamType = document.getElementById("station-webcamType");
    stationWebcamType.innerHTML = `Webcam: ${activeStation.webcamType}`;
    let stationTransferType = document.getElementById("station-transferType");
    stationTransferType.innerHTML = `Transfer: ${activeStation.transferType}`;
    let sundialDescription = document.getElementById("sundial-name");
    sundialDescription.innerHTML = `Sundial name: ${activeStation.sundialName}`;
    let sundialInfo = document.getElementById("sundial-info");
    sundialInfo.innerHTML = `Sundial info: ${activeStation.sundialInfo}`;
    let stationWebsite = document.getElementById("station-website");
    stationWebsite.innerHTML = `Website: ${activeStation.websiteUrl}`;
    let stationTeamName = document.getElementById("station-teamName");
    stationTeamName.innerHTML = `Team: ${activeStation.teamName}`;
}

showStationData = () => {
    const overlays = document.getElementsByClassName('image-overlay-off');
    while (overlays.length > 0) {
        overlays[0].classList.add('image-overlay');
        overlays[0].classList.remove('image-overlay-off');
    }
}

function setGlobePOV(currentAltitude) {
    const lat = 25;
    const lng = 25;
    globe.height(window.innerHeight);
    let altitude;
    if (window.innerWidth > LANDSCAPE_WIDTH_SIZE) // landscape
    {
        globe.height(window.innerHeight);
        globe.width(calcWidth());
        altitude = DEFAULT_LANDSCAPE_ALTITUDE;
    } else { // portrait
        globe.height(calcHeight());
        globe.width(window.innerWidth);
        altitude = DEFAULT_PORTRAIT_ALTITUDE;
    }
    if (!currentAltitude) {
        globe.pointOfView({lat, lng, altitude});
    }
}

function calcHeight() {
    const stationEl = document.getElementById('station');
    let screenOccupy = stationEl.offsetHeight / window.innerHeight;
    let multiplier = screenOccupy === 0 ? 1 : (1 - screenOccupy) * 1.1;

    return window.innerHeight * multiplier;
}

function getArcData() {
    const arcData = [
        {
            startLat: 0,
            startLng: lng,
            endLat: 90,
            endLng: lng,
            color: "#d09f0c"
        },
        {
            startLat: 0,
            startLng: lng,
            endLat: -90,
            endLng: lng,
            color: "#d09f0c"
        }
    ];
    return arcData
}

function drawArcOnGlobe(arcData) {
    globe
        .arcsData(arcData)
        .arcColor('color')
        .arcAltitude(0)
        .arcStroke(1)
        .arcDashGap(0)
}

function toggleMobileMenu(menu) {
    menu.classList.toggle('open');
    document.getElementsByClassName("container")[0].classList.toggle('transparent');
    document.getElementsByClassName("earthLatLogo")[0].classList.toggle('transparent');
    document.getElementById("landingLinks").classList.toggle('open');
}

onClickClose = () => {
    const overlays = document.getElementsByClassName('image-overlay');
    while (overlays.length > 0) {
        overlays[0].classList.add('image-overlay-off');
        overlays[0].classList.remove('image-overlay');
    }
}

window.addEventListener('resize', (event) => {
    setGlobePOV(true);
});
