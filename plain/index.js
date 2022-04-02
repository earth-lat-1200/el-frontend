let shownImage;
let globe;
let stations = [];
let activeStation = {};
const DEFAULT_LANDSCAPE_ALTITUDE = 2.5;
const DEFAULT_PORTRAIT_ALTITUDE = 3;
const MINIMUM_ALTITUDE = 4;
const functionsKey = 'oH/GOJSarf1jT1LutARtm4aOhJWOgELdw3Nka1DkX6mDE2B6l93uuA==';

function getFeatures(stations) {
    let index = 0;

    return stations.map(station => {
        return {
            "type": "Feature",
            "properties": {
                "id": index++,
                "name": station.stationName,
                "latitude": station.latitude,
                "longitude": station.longitude,
                "pop_max": 2189000,
                "pop_min": 229398,
                "pop_other": 1149981,
            }
        };
    });
}

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
            color : 'red'
        };
    });
}

function getStations() {
    return fetch("https://earth-lat-1200.azurewebsites.net/api/GetAllStations", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-functions-key': functionsKey
        }
    }).then(res => res.json()).then(s => {
        stations = s.result.value;
    })
}

function getClosestStation(){
    const nullMeridian = calcNoonMeridian();
    const currentLongitude = nullMeridian;
    const result = stations.reduce((prev, curr) => {
        const distanceCurr = curr.longitude - currentLongitude;
        const distancePrev = prev.longitude - currentLongitude;
        
        return Math.abs(distanceCurr) < Math.abs(distancePrev) ? curr : prev;
    }, {longitude : -20000.00});
    return result;
}

document.addEventListener("DOMContentLoaded", function () {
    getStations().then(() => {
        let features = getFeatures(stations);
        let gData = getMarkerData(stations);

        const markerSvg = `<svg viewBox="-4 0 36 36" width="36" height="36">
        <path fill="currentColor" d="M 14.284 0.12 C 18.086 0.12 21.169 2.969 21.169 6.484 C 21.169 12.224 14.284 18.304 14.284 18.304 C 14.284 18.304 7.399 12.275 7.399 6.484 C 7.399 2.969 10.481 0.12 14.284 0.12 Z" style=""></path>
        <circle fill="black" cx="12.397" cy="9.693" r="7" style="" transform="matrix(0.604555, 0, 0, 0.579183, 6.790349, 1.322492)"></circle>
      </svg>`;

        let onInit = true;
        let lng = 0;
        let zoom = { altitude: 2.5 };
        globe = Globe()
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
            .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
            .width(calcWidth())
            .height(window.innerHeight)
            .showAtmosphere(true)
            .htmlElementsData(gData)
            .htmlElement(d => {
              const el = document.createElement('div');
              el.innerHTML = markerSvg;
              if (d.stationId == activeStation.stationId) {
                el.style.color = "red";
                el.style.opacity = 0.8;
              } else {
                el.style.color = "white";
                el.style.opacity = 0.5;
              }
              el.style.width = `${d.size}px`;
              el.id = d.stationId;
              el.className = "stationIcon"
              el.style['pointer-events'] = 'auto';
              el.style.cursor = 'pointer';
              el.onclick = () => {
                activeStation = stations[d.id];
                loadImage()
                let stationIcons = document.getElementsByClassName("stationIcon");
                for (let stationIcon of stationIcons) {
                    stationIcon.style.color = "white";
                    stationIcon.style.opacity = 0.5;
                }
                el.style.color = "red";
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

function getStationPicture() {
    const stationId = activeStation.stationId;
    return fetch(`https://earth-lat-1200.azurewebsites.net/api/GetLatestTotalImageById?id=${stationId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-functions-key': functionsKey
        }
    }).then(res => res.json())
        .then(res => {
            return 'data:image/jpeg;base64,' + res.result.value.img
        })
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
    if(!currentAltitude){
        globe.pointOfView({lat, lng, altitude});
    }
}

onMobile = () => {
    return window.innerWidth < 837;
}

resizeStationInfoPortrait = () => {
    const stationEl = document.getElementById('station');
    const stationWidth = stationEl.offsetWidth;
    stationEl.style.left = onMobile() ? 'auto' : `${(window.innerWidth - stationWidth) / 2}px`;
    stationEl.style.top = 'auto';
    stationEl.style.bottom = onMobile() ? '20px' : '5px';
    stationEl.style.maxWidth = onMobile() ? 'initial' : '40%';
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
    let stationDescription = document.getElementById("station-description");
    stationDescription.innerHTML = `Sundial name: ${activeStation.sundialName}, sundial info: ${activeStation.sundialInfo}`;
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
    setGlobePOV();
});

function toggleMobileMenu(menu) {
    menu.classList.toggle('open');
    document.getElementById("landingLinks").classList.toggle('open');
}