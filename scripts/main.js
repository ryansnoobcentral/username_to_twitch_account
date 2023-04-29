const searchBox = document.getElementById('top-search')

// fetch("https://us.api.blizzard.com/data/wow/pvp-season/33?namespace=dynamic-us&locale=en_US")
//     .then(parseJson)
//     .then()
//     .catch(() => {
//       console.log("something is fucked");
//     });

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