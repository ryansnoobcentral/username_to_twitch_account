// RUN npx webpack EVERYTIME THIS IS FILE IS CHANGED.  WEBPACK ALLOWS NODE.JS TO BE RAN WITHIN THE BROWSER.

// Const for realms.
const realms = document.getElementById('realm');
// Const for realm-title.
const realmsTitle = document.getElementById('realm-title');
// Const for leaderboards.
const leaderboards = document.getElementById('leaderboards');
// Const for leaderboards title.
const leaderboardsTitle = document.getElementById('leaderboards-title');
// Const for search bar element.
const searchBox = document.getElementById('top-search');
// Const for Region dropdown.
const region = document.getElementById('region');
// Const for region title.
const regionTitle = document.getElementById('region-title');
// Variable for region selected.
let regionType = "us";
// Variable for search bar elements inputted data.
let curChar = ["", "utterlycrazy"];
// Variable for leaderboards select.
let leaderboardType = "shuffle";
// Variable of all WOW realms.
let allRealms;
// Variable of current realm selected.
let curRealm = "illidan";
// Variable for search string.
// /profile/wow/character/{realmSlug}/{characterName}/pvp-bracket/{pvpBracket}
let charQueryString = "/profile/wow/character/" + curRealm + "/" + curChar[1] + "/pvp-bracket/"
    + leaderboardType + "?namespace=profile-" + regionType;
// Client ID.
let clientID = "2f7360b493cf41c9bc8941dc647dbb26";
// Client Secret.
let clientSecret = "rEEM3k7nfo1WJaTpSQR1PR53vlwZ8KRA";


// Search box action listener.
searchBox.onsubmit = (ev) => {
    console.log('submitted top-search with', ev);
    // https://stackoverflow.com/a/26892365/1449799
    const formData = new FormData(ev.target);
    console.log(formData);
    // This logs the FormData object's values into the variable of curChar.
    for (curChar of formData.entries()) {
        console.log(`${curChar[0]}, ${curChar[1]}`);
    }
    ev.preventDefault();
    updateCharQueryString();
    // I used the supplied libraries method of query, which ends up returning a JSON instead of a promise like fetch.
    // However, in a sense this is just fetch with the return promise.json(). The API has a default time out of 10 seconds
    // if this is not found.
    BnetApi.query(charQueryString)
        .then(parseCharacter)
        .catch((error) => {
            console.log("Query Failed", error);
        });
}

// Leaderboards dropdown action listener.
leaderboards.onclick = (ev) => {
    console.log("Leaderboards ", ev.target.innerText);
    leaderboardType = ev.target.innerText.toLowerCase();
    leaderboardsTitle.innerText = "Leaderboards: " + leaderboardType;
    updateCharQueryString();
}

// Region dropdown action listener.
region.onclick = (ev) => {
    console.log("Region selected", ev.target.innerText);
    regionType = ev.target.innerText;
    regionTitle.innerText = "Region: " + regionType;
    BnetApi = new BlizzAPI({
        region: regionType.toLowerCase(),
        clientId: clientID,
        clientSecret: clientSecret,
    });
    updateCharQueryString();
}

// Realms dropdown action listener.
realms.onclick = (ev) => {
    console.log("Realm selected", ev.target.innerText);
    //TODO handle realms
}
// This gathers a new key to use the Blizzard API.
const {BlizzAPI} = require("blizzapi");

// Default key.
let BnetApi = new BlizzAPI({
    region: 'us', clientId: clientID, clientSecret: clientSecret,
});

// Default gather of realms.
BnetApi.query("/data/wow/realm/index?namespace=dynamic-" + regionType)
    .then(parseRealms)
    .catch(error => {
        console.log("Error getting realms", error);
    });

// Parses character data from API.
function parseCharacter(data) {
    console.log(data);
}

// Parses realm data from API.
function parseRealms(realms) {
    console.log(realms);
    allRealms = realms.realms.map(realm => realm.name.en_US);
    console.log("Current realm list for " + regionType, allRealms);
}

// Updates character query string.
function updateCharQueryString() {
    charQueryString = "/profile/wow/character/" + curRealm + "/" + curChar[1] + "/pvp-bracket/"
        + leaderboardType + "?namespace=profile-" + regionType;
}