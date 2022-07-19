const hourOffset = 3600;
const millisConverter = 1000

$(document).ready(function () {
    $('#datePicker')[0].value = new Date().toISOString().substring(0,10);
    get("http://localhost:7071/api/StationNames", loadStationNames);
    const datapoints = [{start:0*hourOffset, end:12*hourOffset},{start: 4*hourOffset, end:14*hourOffset}];
    let date = new Date($('#datePicker')[0].value)
    //createTemperatureChart(labels, datapoints,"temperatureChart")
    createSendTimeChart(date, datapoints)
    //createTemperatureChart(labels, datapoints,"brightnessChart")
    //createTemperatureChart(labels, datapoints,"uploadedPPMChart")
});

function get(url, fun) {
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    }).then(response => {
        if (!response.ok) {
            logout()
        }
        return response.json()
    }).then(data => {
        fun(data.value)
    }).catch(_=>logout())
}

function logout() {
    localStorage.removeItem('token')
    window.location = "http://localhost:63342/el-frontend/plain/login.html";
}

function loadStationNames(stationNamesDto) {
    stationNamesDto.stationNames.forEach(x => {
        $('#stationNames').append($('<option>', {
            text: x,
            value: x
        }));
    })
    $('#stationNames').val(stationNamesDto.userStationName)
}

function onDateChanged() {
    let date = new Date($('#datePicker')[0].value)
    console.log(date)
}
