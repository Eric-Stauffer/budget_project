let request = new XMLHttpRequest();

request.open("GET", "data.json", false)

request.send()
setUserData();
let jsonData = JSON.parse(request.response)

let userData;

for (user in jsonData) {
    if (currentUser == jsonData[user].userName) {
        userData = jsonData[user]
    }
}