const FUNCTIONS_KEY = 'oH/GOJSarf1jT1LutARtm4aOhJWOgELdw3Nka1DkX6mDE2B6l93uuA==';


function login() {
    const username = $('#username-field')[0].value
    const password = $('#password-field')[0].value

    fetch("https://earth-lat-1200.azurewebsites.net/api/Authenticate", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-functions-key': `${FUNCTIONS_KEY}`
        },
        body: `{
            "username": "${username}",
            "password": "${password}"
        }`,
    }).then(response => {
        if (!response.ok) {
            alert("Request failed")
        }
        return response.json()
    }).then(data => {
        if (Math.floor(data.result.statusCode / 100) !== 2) {
            alert("Credentials incorrect")
        } else {
            forward(data)
        }
    }).catch(_ => alert('an unexpected error occurred'))
}

function forward(data) {
    localStorage.setItem('token', data.result.value)
    window.location = "https://www.earthlat1200.org/statistics.html";
}
