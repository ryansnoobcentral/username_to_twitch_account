// RUN npx webpack EVERYTIME THIS IS FILE IS CHANGED.  WEBPACK ALLOWS NODE.JS TO BE RAN WITHIN THE BROWSER.
const searchBox = document.getElementById('top-search')
let pair;

searchBox.onsubmit = (ev) => {
    console.log('submitted top-search with', ev)
    // https://stackoverflow.com/a/26892365/1449799
    const formData = new FormData(ev.target)
    console.log(formData)
    // This logs the FormData object's values into the variable of pair.
    for (pair of formData.entries()) {
        console.log(`${pair[0]}, ${pair[1]}`);
    }
    ev.preventDefault()
}

// This gathers a new key to use the Blizzard API.
const {BlizzAPI} = require("blizzapi");

const BnetApi = new BlizzAPI({
    region: "us",
    clientId: "2f7360b493cf41c9bc8941dc647dbb26",
    clientSecret: "rEEM3k7nfo1WJaTpSQR1PR53vlwZ8KRA",
});

// Used to query or more or less known as "fetch" the URL and then use the promise to extract the JSON data.  The
// API has a default time out of 10 seconds if this is not found.
BnetApi.query("/sc2/profile/1/2/242838")
    .then(parseData)

// Parses data from API.
function parseData(data) {
    console.log(data);
}
