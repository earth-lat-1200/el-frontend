$(document).ready(function() {
    get("http://localhost:7071/api/StationNames", loadStationNames)
});

function loadStationNames (stationNamesDto){
    stationNamesDto.stationNames.forEach(x=>{
        $('#stationNames').append($('<option>', {
            text: x,
            value: x
        }));
    })
    $('#stationNames').val(stationNamesDto.userStationName)
}

function get (url, fun){
    fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization' : `Bearer ${localStorage.getItem('token')}`
        }
    }).then(response => {
        if (!response.ok) {
            logout()
        }
        return response.json()
    }).then(data => {
        fun(data.value)
    }).catch(error => console.log(error))
}

function logout(){
    localStorage.removeItem('token')
    window.location = "http://localhost:63342/el-frontend/plain/login.html";
}
