function login() {
    const username = $('#username-field')[0].value
    const password = $('#password-field')[0].value

    fetch("http://localhost:7071/api/Authenticate", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: `{
            "username": "${username}",
            "password": "${password}"
        }`,
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
        }
        return response.json()
    }).then(data => {
        localStorage.setItem('token',data.result.value.token)
        localStorage.setItem('station',data.result.value.stationName)
        window.location = "http://localhost:63342/el-frontend/plain/statistics.html";
    }).catch(error => console.log(error))
}
