// RUN npx webpack EVERYTIME THIS IS FILE IS CHANGED.  WEBPACK ALLOWS NODE.JS TO BE RAN WITHIN THE BROWSER.


const {BlizzAPI} = require("blizzapi");

const BnetApi = new BlizzAPI({
    region: "us",
    clientId: "2f7360b493cf41c9bc8941dc647dbb26",
    clientSecret: "rEEM3k7nfo1WJaTpSQR1PR53vlwZ8KRA",
});

// Used to query or more or less known as "fetch" the URL and then use the promise to extract the JSON data
BnetApi.query("/sc2/profile/1/2/242838")
    .then(parseJson)
    .then(handleJson);

const searchBox = document.getElementById('top-search')

// fetch("https://us.api.blizzard.com/data/wow/pvp-season/33?namespace=dynamic-us&locale=en_US")
//     .then(parseJson)
//     .then()
//     .catch(() => {
//       console.log("something is fucked");
//     });

// Parses JSON.
function parseJson(promise) {
    console.log(promise);
    return promise.json();
}

function handleJson(data) {
    console.log(data);
}

searchBox.onsubmit = (ev) => {
    console.log('submitted top-search with', ev)
    // https://stackoverflow.com/a/26892365/1449799
    const formData = new FormData(ev.target)
    console.log(formData)
    for (const pair of formData.entries()) {
        console.log(`${pair[0]}, ${pair[1]}`);
    }
    ev.preventDefault()
}