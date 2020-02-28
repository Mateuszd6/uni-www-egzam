const servAddress = "";
let pokemonName = "";
function updateDangerous() {
    fetch(servAddress + `/checkDangerous/${pokemonName}`)
        .then(function (response) { return response.json(); })
        .then(function (myJson) {
        let stats = document.getElementById("sel-stats");
        let dangText = stats.querySelector(".sel-dangerous");
        dangText.textContent = myJson >= 3 ? "TAK" : "NIE";
    });
}
function report() {
    console.log("Reported!");
    fetch(servAddress + `/report/${pokemonName}`, {
        method: 'POST',
        mode: 'cors',
        cache: 'no-cache',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        redirect: 'follow',
        referrer: 'no-referrer',
        body: "{}"
    });
    updateDangerous();
}
window.onload = () => {
    let myParam = location.search.split('pokemonName=')[1];
    pokemonName = myParam;
    // If no pokemon is selected, go back to the list.
    if (myParam == null)
        window.location.href = "list.html";
    console.log("Current pokemon is: " + myParam);
    fetch(servAddress + `/stats/${myParam}`)
        .then(function (response) { return response.json(); })
        .then(function (myJson) {
        let stats = document.getElementById("sel-stats");
        stats.querySelector(".sel-name")
            .textContent = myJson.name;
        stats.querySelector(".sel-height")
            .textContent = myJson.height;
        stats.querySelector(".sel-weight")
            .textContent = myJson.weight;
    });
    fetch(servAddress + `/types/${myParam}`)
        .then(function (response) { return response.json(); })
        .then(function (myJson) {
        let stats = document.getElementById("sel-stats");
        let types = "";
        for (let i = 0; i < myJson.length; ++i) {
            types = types + myJson[i] + " ";
        }
        let typestxt = stats.querySelector(".sel-types");
        typestxt.textContent = types;
    });
    updateDangerous();
};
