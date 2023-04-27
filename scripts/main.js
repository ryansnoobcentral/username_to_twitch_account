// npm install blizzapi

const searchBox = document.getElementById('top-search')

// https://us.api.blizzard.com/data/wow/pvp-season/{pvpSeasonId}/pvp-leaderboard/{pvpBracket}?namespace=static-us
// /data/wow/pvp-season/{pvpSeasonId}/pvp-leaderboard/{pvpBracket}


// Gets authentication key from blizzard API
const { BlizzAPI } = require("blizzapi");

/**
 * Or using TypeScript:
 * import { BlizzAPI } from 'blizzapi';
 */

const api = new BlizzAPI({
  region: "us",
  clientId: "2f7360b493cf41c9bc8941dc647dbb26",
  clientSecret: "rEEM3k7nfo1WJaTpSQR1PR53vlwZ8KRA",
});

const data = await api.query("/path/to/endpoint");

console.log(data);

fetch("https://us.api.blizzard.com/data/wow/pvp-season/33?namespace=dynamic-us&locale=en_US")
    .then(parseJson)
    .then()
    .catch(() => {
      console.log("something is fucked");
    });

// Parses JSON.
function parseJson(promise) {
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