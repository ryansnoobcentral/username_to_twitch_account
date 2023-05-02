// RUN npx webpack EVERYTIME THIS IS FILE IS CHANGED.  WEBPACK ALLOWS NODE.JS TO BE RAN WITHIN THE BROWSER.


// This gathers a new key to use the Twitch API and creates apiClient to call api with.
import {AppTokenAuthProvider} from '@twurple/auth';
import {ApiClient, HelixStream} from '@twurple/api';

//region API KEYSSSSS
const {BlizzAPI} = require("blizzapi");
// Variable Client ID.
const wowClientID = "2f7360b493cf41c9bc8941dc647dbb26";
// Variable Client Secret.
const wowClientSecret = "rEEM3k7nfo1WJaTpSQR1PR53vlwZ8KRA";
// Default key.
// This gathers a new key to use the Blizzard API.
let BnetApi = new BlizzAPI({
    region: 'us', clientId: wowClientID, clientSecret: wowClientSecret,
});

// This gathers a new key to use the Twitch API and creates apiClient to call api with.
const twitchClientId = '87ujzh69at7evv4anwrrix45r8ynlx';
const twitchClientSecret = '77nt7xhgxutssv1euf7dqj6g5v1tj1';
const authProvider = new AppTokenAuthProvider(twitchClientId, twitchClientSecret);
const apiClient = new ApiClient({authProvider});
//endregion

// Testing twitch API
getWOWSection();


//region Start of variables.....
// Const for Armory Link
const armoryDiv = document.getElementById('armory');
// Const for possible Twitch links
const twitchLinkDiv = document.getElementById('twitch.tv');
// Consts for image div.
const imgDiv = document.getElementById('character-picture');
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
// Variable for dropdown items.
let dropdownItems;
// Variable for dropdown dividers.
let dropdownDivider;
// Variable for armory Link.
let armoryLinkStringUS = "https://worldofwarcraft.blizzard.com/en-us/character/us/" + curRealm + "/" + curChar[1];
let armoryLinkStringEU = "https://worldofwarcraft.blizzard.com/en-gb/character/eu/" + curRealm + "/ " + curChar[1];
let armoryLinkStringKR = "https://worldofwarcraft.blizzard.com/ko-kr/character/kr/" + curRealm + "/ " + curChar[1];
//endregion End of variables.

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
    updateArmoryLinkString();
    // I used the supplied libraries method of query, which ends up returning a JSON instead of a promise like fetch.
    // However, in a sense this is just fetch with the return promise.json(). The API has a default time out of 10 seconds
    // if this is not found.
    BnetApi.query(charQueryString)
        .then(parseCharacter)
        .catch((error) => {
            console.log("Character Query Failed", error);
            alert("Character Not Found");
        });
    // Query's Image of character.
    BnetApi.query(charRenderImage)
        .then((ev) => {
            console.log("Character Image parsed", ev.assets[2]);
            imgDiv.style.background = `url(${ev.assets[2].value}) no-repeat center center`;
            imgDiv.style.backgroundSize = "cover";
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
        clientId: wowClientID,
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
    updateArmoryLinkString();
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
    updateArmoryLinkString();
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

// Default gather of realms.
BnetApi.query("/data/wow/realm/index?namespace=dynamic-" + regionType)
    .then(parseRealms)
    .catch(error => {
        console.log("Error getting realms", error);
    });

// Parses character data from API.
function parseCharacter(data) {
    console.log("region ", regionType);
    console.log(data);
    if (regionType === "us") {
        armoryDiv.setAttribute("href", armoryLinkStringUS);
    } else if (regionType === "eu") {
        armoryDiv.setAttribute("href", armoryLinkStringEU);
    } else if (regionType === "kr") {
        armoryDiv.setAttribute("href", armoryLinkStringKR);
    }
}

// Parses realm data from API.
function parseRealms(realmsList) {
    console.log(realmsList);
    allRealms = realmsList.realms.map(realm => realm.name.en_US);
    // Populates realm list in dropdown.
    realms.getElementsByClassName('dropdown-divider');
    realms.getElementsByClassName('dropdown-item');
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

// Updates armory link string.
function updateArmoryLinkString() {
    armoryLinkStringUS = "https://worldofwarcraft.blizzard.com/en-us/character/us/" + curRealm + "/" + curChar[1];
    armoryLinkStringEU = "https://worldofwarcraft.blizzard.com/en-gb/character/eu/" + curRealm + "/ " + curChar[1];
    armoryLinkStringKR = "https://worldofwarcraft.blizzard.com/ko-kr/character/kr/" + curRealm + "/ " + curChar[1];
}

// This allows me to get all streams associated with world of warcraft.
async function getWOWSection() {
    const game = await (await apiClient.games.getGameByName('World of Warcraft')).getStreamsPaginated().getAll();
    console.log(game);
    let allStream = [];
    for (let i = 0; i < game.length; i++) {
        let helixStreamName = game[i].userName;
        allStream.push(helixStreamName)
    }
    console.log(allStream);
}