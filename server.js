const express = require("express");
const { reset } = require("nodemon");
const bcrypt = require('bcryptjs');
const cors = require("cors");

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

const db = {
    users: [
        {
            id: "123",
            name: "Joe",
            email: "joe@joe.com",
            password: bcrypt.hashSync("chocolate"),
            entries: 0,
            joined: new Date()
        },
        {
            id: "456",
            name: "Satmoi",
            email: "sat@bss.com",
            password: bcrypt.hashSync("oops"),
            entries: 0,
            joined: new Date()
        }
    ]
};

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
    db.users.push({
        id: "789",
        name: name,
        email: email,
        password: hash,
        entries: 0,
        joined: new Date()
    });
    res.json(db.users.slice(-1));
});

app.get("/profile/:id", (req, res) => {
    const { id } = req.params;
    let found = false;
    db.users.forEach(user => {
        if (user.id === id) {
            found = true;
            return res.json(user);
        }
    });
    if (!found) {
        res.status(400).json("user not found");
    }
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