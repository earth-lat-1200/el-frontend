const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

function login() {
    // const username = loginForm.username.value;
    // const password = loginForm.password.value;

    fetch("http://localhost:7071/api/Authenticate", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: `{
            "username": "admin",
            "password": "admnpsswrd"
        }`,
    }).then(response => {
        if (!response.ok) {
            throw new Error(`Request failed with status ${response.status}`)
        }
        return response.json()
    }).then(data => {
        console.log(data)
    }).catch(error => console.log(error))
}
