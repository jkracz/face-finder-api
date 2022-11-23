const express = require("express");
const { reset } = require("nodemon");
const bcrypt = require('bcryptjs');
const cors = require("cors");
const knex = require('knex');
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const { getProfileById } = require("./controllers/profile");
const image = require("./controllers/image");

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

app.post("/signin", signin.handleSignin(db, bcrypt));

app.post("/register", (req, res) => {register.handleRegister(req, res, db, bcrypt)});

app.get("/profile/:id", (req, res) => {getProfileById(req, res, db)});

app.put("/image", (req, res) => {image.addImage(req, res, db)});

app.post("/image", (req, res) => {image.handleClarifaiCall(req, res)})

app.listen(3000, () => {
    console.log("app is running on port 3000");
});