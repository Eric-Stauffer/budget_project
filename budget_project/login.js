let currentUser;

function createPopupLogin() {
    document.getElementById("login-popup").classList.add("active")
    document.querySelector(".overlay").classList.add("active")
}

function removePopupLogin() {
    document.getElementById("login-message").innerHTML = ""
    document.getElementById("login-popup").classList.remove("active")
    document.querySelector(".overlay").classList.remove("active")
}

function giveErrorMessage() {
    let message = document.getElementById("login-message")
    message.style.color = '#ff0033'
    message.innerHTML = "* Incorrect Username or Password *"
}

function logout() {
    localStorage.removeItem("userName")
    window.location = ("fin-planner.html")
}

function setUserData() {
    let userWelcome = document.getElementById("welcome-user")
    let logoutWelcome = document.getElementById("logout-button")
    let userName = localStorage.getItem("userName")
    if (userName != null) {
        currentUser = userName;
        userWelcome.innerHTML = "Welcome " + currentUser
    } else {
        logoutWelcome.innerHTML = ''
        createPopupLogin();
    }

}
async function verifyLogin() {

    let login = {
        userName: document.getElementById("username").value,
        password: document.getElementById("password").value
    }
    let response = await fetch('http://universe.tc.uvu.edu/cs2550/assignments/PasswordCheck/check.php', {
        method: 'POST',
        headers: {
            'Content-Type': "application/x-www-form-urlencoded"
        },
        body: "userName=" + login.userName + "&password=" + login.password
    })

    if (response.ok) {
        let result = await response.json();
        if (result["result"] == "valid") {
            localStorage.setItem("userName", result["userName"])
            window.location = "fin-planner.html"
        } else if (result["result"] == "invalid") {
            console.log("Incorrect Login Credentials")
            giveErrorMessage();
        } else { console.log("something went wrong") }
    } else(console.log("There was an error in validating the login"))
}