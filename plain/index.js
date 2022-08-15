const DEFAULT_LANDSCAPE_ALTITUDE = 2.5;
const DEFAULT_PORTRAIT_ALTITUDE = 3.2;
const LANDSCAPE_WIDTH_SIZE = 821;
const FUNCTIONS_KEY = 'oH/GOJSarf1jT1LutARtm4aOhJWOgELdw3Nka1DkX6mDE2B6l93uuA==';

let globe;
let stations = [];
let activeStation = {};

function getMarkerData(stations) {
    let index = 0;
    return stations.map(station => {
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


function getClosestStation() {
    const nullMeridian = calcNoonMeridian();
    const currentLongitude = nullMeridian;
    const result = stations.reduce((prev, curr) => {
        const distanceCurr = curr.longitude - currentLongitude;
        const distancePrev = prev.longitude - currentLongitude;

        return Math.abs(distanceCurr) < Math.abs(distancePrev) ? curr : prev;
    }, {longitude: -20000.00});
    return result;
}

document.addEventListener("DOMContentLoaded", function () {
    getStations().then(() => {
        let gData = getMarkerData(stations);

        let onInit = true;
        let lng = 0;
        let zoom = {altitude: 2.5};
        globe = Globe()
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
            .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
            .width(calcWidth())
            .height(window.innerHeight)
            .showAtmosphere(true)
            .htmlElementsData(gData)
            .htmlElement(d => {
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
            })
            (document.getElementById('globe'))
        activeStation = getClosestStation();
        loadImage();
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

            globe
                .arcsData(arcsData)
                .arcColor('color')
                .arcAltitude(0)
                .arcStroke(1)
                .arcDashGap(0)
            setTimeout(refresh, 5000);
        }

        refresh();

        if (onInit) {
            globe.pointOfView({lat: 0, lng: lng + 10, altitude: zoom.altitude}, 1000)
            onInit = false;
        }

        setGlobePOV();
    });
})

function calcNoonMeridian() {
    var nowUtc = moment().utc();
    let timeEquation = calcTimeEquation(nowUtc.dayOfYear());
    let currTimeinH = nowUtc.hour() + nowUtc.minute() / 60 + nowUtc.second() / 3600;
    let long = (-180 / 12) * (currTimeinH + timeEquation - 12);
    return long;
}

function calcTimeEquation(currDay) {
    let teq = (-0.171) * Math.sin(0.0337 * currDay + 0.465) - 0.1299 * Math.sin(0.01787 * currDay - 0.168);
    return teq
}

function calcWidth() {
    return window.innerWidth * 1.35;
}

function calcHeight() {
    const stationEl = document.getElementById('station');
    let screenOccupy = stationEl.offsetHeight / window.innerHeight;
    let multiplier = screenOccupy === 0 ? 1 : (1 - screenOccupy) * 1.1;

    return window.innerHeight * multiplier;
}

loadImage = () => {
    const imgEl = document.getElementById('station-image');
    const divEl = document.getElementById('station');
    getStationPicture()
        .then(resImg => {
            updateActiveStationData();
            imgEl.setAttribute(
                'src', resImg
            );
            divEl.style.display = 'block';
            imgEl.style.objectFit = 'contain';
            // UGLY solution, couldn't find an alternative yet
            setTimeout(function () {
                setGlobePOV(true);
                setGlobePOV(true);
                setGlobePOV(true);
            }, 100);
        });
}

function setGlobePOV(currentAltitude) {
    const lat = 10;
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

onClickClose = () => {
    const overlays = document.getElementsByClassName('image-overlay');
    while (overlays.length > 0) {
        overlays[0].classList.add('image-overlay-off');
        overlays[0].classList.remove('image-overlay');
    }
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

window.addEventListener('resize', (event) => {
    setGlobePOV(true);
});

function toggleMobileMenu(menu) {
    menu.classList.toggle('open');
    document.getElementsByClassName("container")[0].classList.toggle('transparent');
    document.getElementsByClassName("earthLatLogo")[0].classList.toggle('transparent');
    document.getElementById("landingLinks").classList.toggle('open');
}

//region REST CALLS
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

function getStationPicture() {
    const stationId = activeStation.stationId;
    return fetch(`https://earth-lat-1200.azurewebsites.net/api/GetLatestTotalImageById?id=${stationId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-functions-key': FUNCTIONS_KEY
        }
    }).then(res => res.json())
        .then(res => {
            return 'data:image/jpeg;base64,' + res.result.value
        })
}

//endregion
