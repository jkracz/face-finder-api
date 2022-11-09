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

// db.select('*').from('users').then(data => {
//     console.log(data);
// });

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

// const db = {
//     users: [
//         {
//             id: "123",
//             name: "Joe",
//             email: "joe@joe.com",
//             password: bcrypt.hashSync("chocolate"),
//             entries: 0,
//             joined: new Date()
//         },
//         {
//             id: "456",
//             name: "Satmoi",
//             email: "sat@bss.com",
//             password: bcrypt.hashSync("oops"),
//             entries: 0,
//             joined: new Date()
//         }
//     ]
// };

app.get("/", (req, res) => {
    res.json(db.users);
});

app.post("/signin", (req, res) => {
    const { email, password } = req.body;
    if (email === db.users[0].email && bcrypt.compareSync(password, db.users[0].password)) {
        res.json(db.users[0]);
    } else {
        res.status(400).json("error logging in");
    }
});

app.post("/register", (req, res) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db('users')
    .returning('*')
    .insert({
        email: email,
        name: name,
        joined: new Date()
    })
    .then(user => res.json(user[0]))
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
    let found = false;
    db.users.forEach(user => {
        if (user.id === id) {
            found = true;
            user.entries++;
            return res.json(user.entries);
        }
    });
    if (!found) {
        res.status(400).json("user not found");
    }
});

app.listen(3000, () => {
    console.log("app is running on port 3000");
});