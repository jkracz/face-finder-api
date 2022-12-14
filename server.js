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
  connection: process.env.PG_CONNECTION_STRING,
  searchPath: ['knex', 'public'],
});

const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.sendStatus(200);
});

app.get("/health", (req, res) => {res.sendStatus(200)});

app.post("/signin", signin.handleSignin(db, bcrypt));

app.post("/register", (req, res) => {register.handleRegister(req, res, db, bcrypt)});

app.get("/profile/:id", (req, res) => {getProfileById(req, res, db)});

app.put("/image", (req, res) => {image.addImage(req, res, db)});

app.post("/image", (req, res) => {image.handleClarifaiCall(req, res)})

app.listen(process.env.PORT || 3000, () => {
    console.log(`app is running on port ${process.env.PORT || 3000}`);
});