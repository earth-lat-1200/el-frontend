let globe;

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

        let zoom = { altitude: 2.5 };
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
            alert('label clicked!')
            console.log(label)
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

function setGlobePOV() {
    var lat = 10;
    var lng = 25;
    globe.height(window.innerHeight);
    if (window.innerWidth > window.innerHeight) // landscape
    {
        globe.width(calcWidth());
        globe.pointOfView({ lat, lng, altitude: 2.5 });
    } else { // portrait
        globe.width(window.innerWidth);
        globe.pointOfView({ lat, lng, altitude: 3 });
    }
}

window.addEventListener('resize', (event) => {
    setGlobePOV();
});
