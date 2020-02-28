const serverAddress : string = "";

let pokemons = [];
let sortcol = 0;
let sortasc = true;

function populatePokemonList()
{
    let list = document.getElementById("pokemon-table");
    let recordProto = list.querySelector(".pokemon-record-proto") as HTMLElement;

    // Remove all old records
    list.querySelectorAll(".pokemon-record-proto")
        .forEach(x => { if (x != recordProto) x.remove(); });
    recordProto.hidden = false;

    for (let i = 0; i < pokemons.length; ++i) {
        let newRecord = recordProto.cloneNode(true) as HTMLElement;
        let nameHTML = newRecord.querySelector(".pokemon-name") as HTMLLinkElement;
        let heightHTML = newRecord.querySelector(".pokemon-height") as HTMLElement;
        let weightHTML = newRecord.querySelector(".pokemon-weight") as HTMLElement;

        nameHTML.textContent = pokemons[i].name;
        nameHTML.href = "pokemon.html?pokemonName=" + pokemons[i].name;
        heightHTML.textContent = pokemons[i].height;
        weightHTML.textContent = pokemons[i].weight;

        (newRecord.querySelector(".pokemon-dangerous") as HTMLElement)
            .textContent = "NIE";

        list.append(newRecord);
    }

    recordProto.hidden = true;
}

function sortBy(index)
{
    if (index === sortcol)
        sortasc = !sortasc;
    else
        sortcol = index;

    sessionStorage.setItem("SORT_COL", sortcol.toString(10));
    sessionStorage.setItem("SORT_ASC", sortasc ? "true" : "false");

    console.log("sorting by: " + sortcol);
    pokemons.sort(function(a, b) {
        let revsort = sortasc ? 1 : -1;

        if (sortcol === 0)
            return revsort * (a.name.localeCompare(b.name));
        else if (sortcol === 1)
            return revsort * (a.height - b.height);
        else // if (sortcol === 2)
            return revsort * (a.weight - b.weight);
    });

    populatePokemonList();
}

window.onload = () => {
    // If we've been sorting pokemons before, bring back the sorting rules.
    let sortcolSS = sessionStorage.getItem("SORT_COL");
    if (sortcolSS != null)
        sortcol = parseInt(sortcolSS, 10);
    else
        sortcol = 0;

    let sortascSS = sessionStorage.getItem("SORT_ASC");
    if (sortascSS != null)
        sortasc = sortascSS === "true" ? true : false;
    else
        sortasc = false;

    fetch(serverAddress + "/pokemons")
        .then(function(response) { return response.json(); })
        .then(function(myJson) {
            console.log("Pokemons: " + JSON.stringify(myJson));

            pokemons = myJson;

            // This is the hack used for first sorting.
            let savedSortCol = sortcol;
            sortcol = -1;
            sortBy(savedSortCol);
            populatePokemonList();
        });
}
