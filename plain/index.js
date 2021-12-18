let shownImage;

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
        const globe = Globe()
            .globeImageUrl('//unpkg.com/three-globe/example/img/earth-night.jpg')
            .backgroundImageUrl('//unpkg.com/three-globe/example/img/night-sky.png')
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
            loadImage()
        })
        globe.onZoom(v => {
            zoom = v;
        })
        globe.pointOfView({lat: 0, lng: 2, altitude: zoom.altitude}, 1000)
    });
})

loadImage = () => {
    const imgEl = document.getElementById('station-image');
    const divEl = document.getElementById('station');
    fetch('./example_station.png').then(res => res.blob()).then(resImg => {
        shownImage = URL.createObjectURL(resImg);
        imgEl.src = shownImage;
        divEl.style.display = 'block';
    });
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
