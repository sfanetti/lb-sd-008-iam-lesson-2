const http = require('http'),
      path = require('path'),
      express = require('express'),
      bodyParser = require('body-parser');

const sqlite3 = require('sqlite3').verbose();

const app = express();
app.use(express.static('.'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const db = new sqlite3.Database(':memory:');
db.serialize(function () {
    db.run("CREATE TABLE user (username TEXT, password TEXT, title TEXT)");
    db.run("INSERT INTO user VALUES ('admin', 'adminPassword', 'Administrator')");
});

app.get('/', function(req, res) {
    res.sendFile('index.html');
});

app.post('/login', function(req, res) {
    let { username, password } = req.body;
    let query = "SELECT title FROM user WHERE username='" + username + "' AND password='" + password + "'";

    console.log(`username=${username}, password=${password}, query=${query}`);

    db.get(query, (err, row) => {
        if ( err ) {
            console.error(err);
            res.redirect('/index.html#error');
        } else if (!row) {
            res.redirect('/index.html#unauthorized');
        } else {
            res.send(`<div class='success'>
                <h1>Welcome ${row.title}</h1>
                <p>
                    This file contains all your secret data:
                    <br>
                    Secrets:
                    <br>
                    Account info:...
                </p>
            </div>`)
        }
    })
})

app.listen(3000);
console.log('Listening on port 3000');
