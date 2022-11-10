const express = require("express");
const { reset } = require("nodemon");
const bcrypt = require('bcryptjs');
const cors = require("cors");
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'josephkracz',
      password : '',
      database : 'face-finder'
    }
});

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
    res.json(db.users);
});

app.post("/signin", (req, res) => {
    const { email, password } = req.body;
    db.where('email', '=', email)
    .select('email', 'hash')
    .from('login')
    .then(login => {
        if (login.length && bcrypt.compareSync(password, login[0].hash)) {
            return db.select('*').from('users').where('email', '=', login[0].email)
            .then(data => res.json(data[0]))
            .catch(err => res.status(400).json("error logging in"));
        } else {
            res.status(400).json("wrong credentials");
        }
    })
    .catch(err => {
        console.log(err);
        res.status(400).json("error logging in");
    });
});

app.post("/register", (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            .then(user => res.json(user[0]))
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch(err => res.status(400).json('unable to register'));
});

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    db.select('*').from('users').where('id', id).then(user => {
        if (user.length) {
            res.send(user[0]);
        } else {
            res.status(400).json('user not found')
        }
    });
});

app.put("/image", (req, res) => {
    const { id } = req.body;
    db('users').returning('entries')
    .where('id', '=', id)
    .increment('entries', 1)
    .then(entries => {
        res.json(entries[0]);
    })
    .catch(err => res.status(400).json('unable to get entries'));
});

app.listen(3000, () => {
    console.log("app is running on port 3000");
});