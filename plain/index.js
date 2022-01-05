document.addEventListener("DOMContentLoaded", function () {
    fetch('./example_places.geojson').then(res => res.json()).then(places => {
        let onInit = true;
        let lng = 0;
        let zoom = { altitude: 2.5 };

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
            .showAtmosphere(true)
            (document.getElementById('globe'))

        globe.onLabelClick((label, event) => {
            alert('label clicked!')
            console.log(label)
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