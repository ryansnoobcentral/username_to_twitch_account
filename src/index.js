// RUN npx webpack EVERYTIME THIS IS FILE IS CHANGED.  WEBPACK ALLOWS NODE.JS TO BE RAN WITHIN THE BROWSER.

// Const for twitch div.
const twitchDiv = document.getElementById('twitch-embed');
// Const for search within dropdown
const dropdownSearch = document.getElementById('dropdownSearch');
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
let leaderboardType = "3v3";
// Variable of all WOW realms.
let allRealms;
// Variable of current realm selected.
let curRealm = "illidan";
// Variable for search string.
// /profile/wow/character/{realmSlug}/{characterName}
let charQueryString = "/profile/wow/character/" + curRealm + "/" + curChar[1] + "?namespace=profile-" + regionType;
// Variable for pvp string.
let pvpQueryString = "/profile/wow/character/" + curRealm + "/" + curChar[1] + "/pvp-bracket/"
    + leaderboardType + "?namespace=profile-" + regionType;
// Variable for character render.
// /profile/wow/character/{realm-slug}/{character-name}/character-media
let charRenderImage = "/profile/wow/character/" + curRealm + "/" + curChar[1] + "/character-media"
    + "?namespace=profile-" + regionType;
// Variable Client ID.
let clientID = "2f7360b493cf41c9bc8941dc647dbb26";
// Variable Client Secret.
let clientSecret = "rEEM3k7nfo1WJaTpSQR1PR53vlwZ8KRA";
// Variable for dropdown items.
let dropdownItems;
// Variable for dropdown dividers.
let dropdownDivider;


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
    updatePvpQueryString();
    // I used the supplied libraries method of query, which ends up returning a JSON instead of a promise like fetch.
    // However, in a sense this is just fetch with the return promise.json(). The API has a default time out of 10 seconds
    // if this is not found.
    BnetApi.query(charQueryString)
        .then(parseCharacter)
        .catch((error) => {
            console.log("Character Query Failed", error);

        });
    // Query's Image of character.
    BnetApi.query(charRenderImage)
        .then((ev) => {
            console.log("Character Image parsed", ev.assets[0]);
            twitchDiv.style.background = ev.assets[0].value;
        })
        .catch((error) => {
            console.log("Character Image Query Failed", error);

        });
}

// Leaderboards dropdown action listener.
leaderboards.onclick = (ev) => {
    console.log("Leaderboards ", ev.target.innerText);
    leaderboardType = ev.target.innerText.toLowerCase();
    leaderboardsTitle.innerText = "Leaderboards: " + leaderboardType;
    updatePvpQueryString();
}

// Region dropdown action listener.
region.onclick = (ev) => {
    console.log("Region selected", ev.target.innerText);
    regionType = ev.target.innerText.toLowerCase();
    regionTitle.innerText = "Region: " + regionType.toUpperCase();
    BnetApi = new BlizzAPI({
        region: regionType,
        clientId: clientID,
        clientSecret: clientSecret,
    });
    // Updates realm list.
    BnetApi.query("/data/wow/realm/index?namespace=dynamic-" + regionType)
        .then(parseRealms)
        .catch(error => {
            console.log("Error getting realms", error);
        });
    updateCharQueryString();
    updatePvpQueryString();
}

// Realms dropdown action listener.
realms.onclick = (ev) => {
    curRealm = ev.target.innerText.toLowerCase()
        .replace(" ", "-")
        .replace("'", "");
    console.log("Realm selected", curRealm);
    realmsTitle.innerText = "Realm: " + ev.target.innerText;
    updateCharQueryString();
    updatePvpQueryString();
}

// Search within realms dropdown listener.
dropdownSearch.addEventListener("input", function () {
    const searchTerm = dropdownSearch.value.toLowerCase();

    let i = 0;
    dropdownItems.forEach(function (item) {
        i++;
        const text = item.textContent.toLowerCase();

        if (text.indexOf(searchTerm) !== -1) {
            item.style.display = "block";
            // Used so it stops printing an annoying error when I don't care.
            try {
                dropdownDivider[i].style.display = "block";
            } catch (error) {
            }
        } else {
            item.style.display = "none";
            // Used so it stops printing an annoying error when I don't care.
            try {
                dropdownDivider[i].style.display = "none";
            } catch (error) {
            }
        }
    });
});

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
function parseRealms(realmsList) {
    console.log(realmsList);
    allRealms = realmsList.realms.map(realm => realm.name.en_US);
    console.log("Current realm list for " + regionType, allRealms);
    // Populates realm list in dropdown.
    for (let i = 0; i < allRealms.length; i++) {
        let listItem = document.createElement("li");
        let button = document.createElement("button");
        let hr = document.createElement("hr");
        hr.className = "dropdown-divider";
        button.className = "dropdown-item";
        button.innerText = allRealms[i];
        listItem.append(button);
        listItem.append(hr);
        realms.append(listItem);
    }
    dropdownItems = document.querySelectorAll('#realm .dropdown-item');
    dropdownDivider = document.querySelectorAll('#realm .dropdown-divider');
}

// Updates character query string.
function updateCharQueryString() {
    charQueryString = "/profile/wow/character/" + curRealm + "/" + curChar[1].toLowerCase()
        + "?namespace=profile-" + regionType;
    charRenderImage = charRenderImage = "/profile/wow/character/" + curRealm + "/" + curChar[1] + "/character-media"
        + "?namespace=profile-" + regionType;
}

// Updates pvp query string.
function updatePvpQueryString() {
    pvpQueryString = "/profile/wow/character/" + curRealm + "/" + curChar[1].toLowerCase() + "/pvp-bracket/"
        + leaderboardType + "?namespace=profile-" + regionType;
}