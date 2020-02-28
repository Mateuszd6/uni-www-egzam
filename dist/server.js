const sqlite3 = require('sqlite3');
let dbname = 'baza.db';
let dbpath = "../" + dbname;
sqlite3.verbose();
let db = new sqlite3.Database(dbpath);
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const app = express();
app.use(session({ secret: 'ssshhhhh', saveUninitialized: true, resave: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/..'));
var sess; // global session... :(
app.get('/', (req, res) => {
    sess = req.session;
    return res.redirect('/list.html');
});
app.get('/pokemons', (req, res) => {
    sess = req.session;
    console.log('GET /pokemons');
    let retval = [];
    db.all('SELECT name, height, weight FROM pokemon;', [], (err, rows) => {
        rows.forEach((row) => {
            retval.push({ "name": row.name,
                "height": row.height,
                "weight": row.weight });
        });
        res.json(retval);
    });
});
app.get(`/stats/:pokemonName`, (req, res) => {
    sess = req.session;
    console.log(`GET /stats/${req.params.pokemonName}`);
    try {
        db.get("SELECT name, height, weight FROM pokemon WHERE name = ?;", [req.params.pokemonName], (err, row) => {
            if (row == null) {
                console.log("Pokemon " + req.params.pokemonName + " NOT FOUND!");
                return res.status(404).send("");
            }
            else {
                console.log("Pokemon " + req.params.pokemonName + " exists!");
                return res.json({ "name": row.name,
                    "height": row.height,
                    "weight": row.weight });
            }
        });
    }
    catch (_a) {
        return res.status(500).send("");
    }
});
app.get(`/types/:pokemonName`, (req, res) => {
    sess = req.session;
    console.log(`GET /types/${req.params.pokemonName}`);
    try {
        let types = [];
        db.all('SELECT type_id FROM pokemon_types join pokemon on pokemon.id = pokemon_id WHERE pokemon.name = ?;', [req.params.pokemonName], (err, rows) => {
            rows.forEach((row) => {
                types.push(row.type_id);
            });
            res.json(types);
        });
    }
    catch (_a) {
        return res.status(500).send("");
    }
});
app.get(`/checkDangerous/:pokemonName`, (req, res) => {
    sess = req.session;
    console.log(`GET /checkDangerous/${req.params.pokemonName}`);
    try {
        let d = new Date();
        let seconds = Math.floor(d.getTime() / 1000);
        // Check the report from last ours (UNIX timestamo is used)
        db.get('SELECT count(*) as reports FROM report WHERE pokemon_id = ? and (? - report_time) < 3600;', [req.params.pokemonName, seconds], (err, row) => {
            res.json(row.reports);
        });
    }
    catch (_a) {
        return res.status(500).send("");
    }
});
app.post('/report/:pokemonName', (req, res) => {
    sess = req.session;
    console.log(`POST /report/${req.params.pokemonName}`);
    try {
        let stmt = db.prepare('INSERT INTO report (pokemon_id, report_time) values (?, ?);');
        let d = new Date();
        let seconds = Math.floor(d.getTime() / 1000);
        stmt.run(req.params.pokemonName, seconds);
        res.json(true);
    }
    catch (_a) {
        res.json(false);
    }
});
app.listen(process.env.PORT || 3000, () => {
    console.log(`App Started on PORT ${process.env.PORT || 3000}`);
});
