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

//region Start of variables.....
// Const for Armory Link
const armoryDiv = document.getElementById('armory');
// Const for possible Twitch links
const twitchLinkDiv = document.getElementById('twitch.tv');
// Const for closes matching twitch link.
const twitchClosesMatchDiv = document.getElementById('closes-match');
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
let charQueryString = "/profile/wow/character/" + curRealm + "/" + curChar + "?namespace=profile-" + regionType;
// Variable for pvp string.
let pvpQueryString = "/profile/wow/character/" + curRealm + "/" + curChar + "/pvp-bracket/"
    + leaderboardType + "?namespace=profile-" + regionType;
// Variable for character render.
// /profile/wow/character/{realm-slug}/{character-name}/character-media
let charRenderImage = "/profile/wow/character/" + curRealm + "/" + curChar + "/character-media"
    + "?namespace=profile-" + regionType;
// Variable for dropdown items.
let dropdownItems;
// Variable for dropdown dividers.
let dropdownDivider;
// Variable for armory Link.
let armoryLinkStringUS = "https://worldofwarcraft.blizzard.com/en-us/character/us/" + curRealm + "/" + curChar;
let armoryLinkStringEU = "https://worldofwarcraft.blizzard.com/en-gb/character/eu/" + curRealm + "/ " + curChar;
let armoryLinkStringKR = "https://worldofwarcraft.blizzard.com/ko-kr/character/kr/" + curRealm + "/ " + curChar;
// Variable for all WOW steams.
let allStream = [];
// Variable for current stream.
let curStream = null;
// Variable for allStreamObjects.
let game;
//endregion End of variables.

// Test
// console.log("Test query for all characters", BnetApi.query("/data/wow/search/realm?namespace=dynamic-"
//     + regionType + "&q=utterlycrazy"));

//region Default gather of realms.
BnetApi.query("/data/wow/realm/index?namespace=dynamic-" + regionType)
    .then(parseRealms)
    .catch(error => {
        console.log("Error getting realms", error);
    });
//endregion

// Search box action listener.
searchBox.onsubmit = (ev) => {
    console.log('submitted top-search with', ev);
    // https://stackoverflow.com/a/26892365/1449799
    const formData = new FormData(ev.target);
    console.log(formData);
    // This logs the FormData object's values into the variable of curChar.
    for (let parsedForm of formData.entries()) {
        console.log(`${parsedForm[0]}, ${parsedForm[1]}`);
        curChar = parsedForm[1].toLowerCase();
        console.log("Current Character " + curChar);
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
            imgDiv.style.background = `url(${ev.assets[2].value}) no-repeat center center fixed`;
            imgDiv.style.backgroundSize = "cover";
        })
        .catch((error) => {
            console.log("Character Image Query Failed", error);
        });
}

// Leaderboards dropdown action listener.
leaderboards.onclick = (ev) => {
    if (ev.target.nodeName === "BUTTON") {
        console.log("Leaderboards ", ev.target.innerText);
        leaderboardType = ev.target.innerText.toLowerCase();
        leaderboardsTitle.innerText = "Leaderboards: " + leaderboardType;
        updatePvpQueryString();
    }
}

// Region dropdown action listener.
region.onclick = (ev) => {
    console.log(ev.target.nodeName);
    if (ev.target.nodeName === "BUTTON") {
        console.log("Region selected", ev.target.innerText);
        regionType = ev.target.innerText.toLowerCase();
        regionTitle.innerText = "Region: " + regionType.toUpperCase();
        BnetApi = new BlizzAPI({
            region: regionType,
            clientId: wowClientID,
            clientSecret: wowClientSecret,
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
}

// Realms dropdown action listener.
realms.onclick = (ev) => {
    console.log(ev.target.nodeName);
    if (ev.target.nodeName === "BUTTON") {
        curRealm = ev.target.innerText.toLowerCase()
            .replace(" ", "-")
            .replace("'", "");
        console.log("Realm selected", curRealm);
        realmsTitle.innerText = "Realm: " + ev.target.innerText;
        updateCharQueryString();
        updatePvpQueryString();
        updateArmoryLinkString();
    }
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

// Streams list listener
twitchLinkDiv.addEventListener("click", function (ev) {
    console.log(ev.target.innerText);
    curStream = ev.target.innerText;
    twitchClosesMatchDiv.setAttribute("href", "https://www.twitch.tv/" + curStream);
    startStream();
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
    let closestMatch = findClosestMatches(curChar, allStream, 20);
    console.log("closest match array", closestMatch);
    curStream = closestMatch[0].match;
    twitchClosesMatchDiv.setAttribute("href", "https://www.twitch.tv/" + curStream);
    startStream();
    alert("Closest matching stream will now be playing!  Check to see if it's correct.");
    updatePossibleStreamLinks(closestMatch);
    console.log("Closest matching stream. ", closestMatch[0].match);
    console.log("Index of closes matching stream. ", closestMatch.index);
    // let userIDofClosesMatch = apiClient.channels.getChannelInfoById(parseInt(game[closestMatch[0].index].userId));
    // console.log("twitch ID of stream", userIDofClosesMatch);
    // console.log("Twitch stream of user", apiClient.streams.getStreamByUserId(parseInt(game[closestMatch[0].index].userId)));
}

// Parses realm data from API.
function parseRealms(realmsList) {
    console.log(realmsList);
    allRealms = realmsList.realms.map(realm => realm.name.en_US);
    // Populates realm list in dropdown.
    const dividers = realms.getElementsByClassName('dropdown-divider');
    const items = realms.getElementsByClassName('dropdown-item');
    // Remove all existing dividers.
    while (dividers.length > 0) {
        dividers[0].remove();
    }
    // Remove all existing items.
    while (items.length > 0) {
        items[0].remove();
    }
    // Repopulates all.
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
    charQueryString = "/profile/wow/character/" + curRealm + "/" + curChar
        + "?namespace=profile-" + regionType;
    charRenderImage = charRenderImage = "/profile/wow/character/" + curRealm + "/" + curChar + "/character-media"
        + "?namespace=profile-" + regionType;
}

// Updates pvp query string.
function updatePvpQueryString() {
    pvpQueryString = "/profile/wow/character/" + curRealm + "/" + curChar + "/pvp-bracket/"
        + leaderboardType + "?namespace=profile-" + regionType;
}

// Updates armory link string.
function updateArmoryLinkString() {
    armoryLinkStringUS = "https://worldofwarcraft.blizzard.com/en-us/character/us/" + curRealm + "/" + curChar;
    armoryLinkStringEU = "https://worldofwarcraft.blizzard.com/en-gb/character/eu/" + curRealm + "/ " + curChar;
    armoryLinkStringKR = "https://worldofwarcraft.blizzard.com/ko-kr/character/kr/" + curRealm + "/ " + curChar;
}

// Updates the possible stream links dropdown
function updatePossibleStreamLinks(closestMatches) {
    twitchLinkDiv.innerHTML = "";

    for (let i = 0; i < closestMatches.length; i++) {
        let li = document.createElement("li");
        li.classList.add("dropdown-item");
        li.innerText = closestMatches[i].match;
        twitchLinkDiv.append(li);
    }
}

// This allows me to get all streams associated with world of warcraft.
async function getWOWSection() {
    game = await (await apiClient.games.getGameByName('World of Warcraft'))
        .getStreamsPaginated().getAll();
    console.log(game);
    for (let i = 0; i < game.length; i++) {
        let helixStreamName = game[i].userName;
        allStream.push(helixStreamName)
    }
    console.log(allStream);
    curStream = allStream[0];
}

//region twitch embedded player
getWOWSection();
console.log("First stream", allStream[0]);

const timeout = 20000; // 10 seconds timeout
const interval = 100; // 100ms interval between checks
let timer = 0;

function waitForInitStream() {
    if (timer < timeout) {
        if (curStream === null) {
            timer += interval;
            setTimeout(waitForInitStream, interval);
        } else {
            startStream();
            console.log("First stream found");
        }
    } else {
        console.log("Timeout exceeded");
    }
}

waitForInitStream();
//endregion

//region Finding the closest matching streams.
function findClosestMatches(target, list, n) {
    let closestMatches = [];
    let distances = [];

    for (let i = 0; i < list.length; i++) {
        const distance = levenshteinDistance(target, list[i]);
        distances.push(distance);
    }

    for (let i = 0; i < n; i++) {
        let closestMatchIndex = 0;
        let closestMatchDistance = Infinity;

        for (let j = 0; j < distances.length; j++) {
            if (distances[j] < closestMatchDistance) {
                closestMatchIndex = j;
                closestMatchDistance = distances[j];
            }
        }

        closestMatches.push({match: list[closestMatchIndex], index: closestMatchIndex});
        distances.splice(closestMatchIndex, 1);
        list.splice(closestMatchIndex, 1);
    }

    return closestMatches;
}

function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1,  // substitution
                    matrix[i][j - 1] + 1,      // insertion
                    matrix[i - 1][j] + 1       // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

//endregion

function startStream() {
    twitchDiv.innerHTML = "";
    var embed = new Twitch.Embed("twitch-embed", {
        width: "100%",
        height: "100%",
        channel: curStream,
        autoplay: false,
        theme: "dark",
        muted: true,
    });

    embed.addEventListener(Twitch.Embed.VIDEO_READY, () => {
        var player = embed.getPlayer();
        player.play();
    });
}