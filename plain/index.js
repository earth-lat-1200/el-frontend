let shownImage;
let globe;
let stations = [];
let activeStation = {};
const DEFAULT_LANDSCAPE_ALTITUDE = 2.5;
const DEFAULT_PORTRAIT_ALTITUDE = 3;
const MINIMUM_ALTITUDE = 4;
const functionsKey = 'HyJtZJmOtyCdwcWZnQwvGyHGUEoyp/0NYR3iZ56qvM2s0i2TQleTCQ==';

function getFeatures(stations) {
    console.log(stations);

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

function getStations() {
    return fetch("https://staging-earth-lat-1200-api.azurewebsites.net/api/GetAllStations", {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-functions-key': functionsKey
        }
    }).then(res => res.json()).then(s => {
        stations = s.result.value;
    })
}

document.addEventListener("DOMContentLoaded", function () {
    getStations().then(() => {
        let features = getFeatures(stations);

        let onInit = true;
        let lng = 0;
        let zoom = { altitude: 2.5 };
        globe = Globe()
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
            .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
            .width(calcWidth())
            .height(window.innerHeight)
            .labelsData(features)
            .labelLat(d => d.properties.latitude)
            .labelLng(d => d.properties.longitude)
            .labelText(d => d.properties.name)
            .labelSize(d => Math.sqrt(d.properties.pop_max) * 4e-4)
            .labelDotRadius(d => Math.sqrt(d.properties.pop_max) * 4e-4)
            .labelColor(() => 'rgba(255, 165, 0, 0.75)')
            .labelResolution(2)
            .showAtmosphere(true)
            (document.getElementById('globe'))

        globe.onLabelClick((feature, event) => {
            activeStation = stations[feature.properties.id];
            let stationInfoLabelEl = document.getElementById("station-info-label");
            stationInfoLabelEl.innerHTML = `${activeStation.stationName} - ${activeStation.location}`;
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
            .arcStroke(1)
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


function getStationPicture() {

    return fetch(`https://staging-earth-lat-1200-api.azurewebsites.net/api/GetLatestDetailImageById?id=${activeStation.stationId}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'x-functions-key': functionsKey
        }
    }).then(res => res.json())
        .then(res => 'data:image/jpeg;base64,' + res.value.img)
}

loadImage = () => {
    const imgEl = document.getElementById('station-image');
    const divEl = document.getElementById('station');
    getStationPicture()
        .then(resImg => {
            console.log(resImg)
            // shownImage = URL.createObjectURL(resImg);
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
    globe.pointOfView({lat, lng, altitude: currentAltitude ? globe.pointOfView().altitude : altitude});
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

function displayActiveStationData() {
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
    displayActiveStationData();
}

window.addEventListener('resize', (event) => {
    setGlobePOV();
});
