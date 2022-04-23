import express from "express";
import bodyParser from "body-parser";
import path from "path";
import { Client } from "pg";
import session from 'express-session';
const {I18n} = require('i18n')
const cookieParser = require('cookie-parser')
const session = require('express-session')


const i18n = new I18n({
  locales: ['en', 'fr'],
  cookie: 'locale',
  defaultLocale: 'en',
  directory: path.join(__dirname, 'locale')
})

const PORT = process.env.PORT || 3000;

const connection = new Client({
  password: "postgres",
  user: "postgres",
  host: "postgres",
});

const app = express();

//Import middleware
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(i18n.init)

app.get("/ping", async (req, res) => {
  const database = await connection
    .query("SELECT 1 + 1")
    .then(() => "up")
    .catch(() => "down");

  res.send({
    environment: process.env.NODE_ENV,
    database,
  });
});


app.get("/login", function (request, response) {
  response.sendFile(path.join(__dirname + "/public/login.html"));
});

app.get("/register", function (request, response) {
  response.sendFile(path.join(__dirname + "/public/register.html"));
});

app.post("/auth", (request: any, response) => {
  var username = request.body.username;
  var password = request.body.password;
  if (username && password) {
    connection.query(
      "SELECT * FROM users WHERE username = $1 AND password = $2",
      [username, password],
      (error: any, results: any)=>{
        console.log("error", error);
        console.log("results", results);
        if (results.rows.length > 0) {
          request.session.loggedin = true;
          request.session.username = username;
          response.redirect("/home");
        } else {
          response.send("Incorrect Username and/or Password!");
        }
        response.end();
      })
  } else {
    response.send("Please enter Username and Password!");
    response.end();
  }
});

app.post("/register", function (request :any, response) {
  var username = request.body.username;
  var password = request.body.password;
  var firstname = request.body.password;
  var lastname = request.body.password;
  var email = request.body.password;
  const qs =
    "INSERT INTO users(username, email, firstname, lastname, password) VALUES($1, $2, $3, $4, $5) RETURNING *";
  const values = [username, email, firstname, lastname, password];
  if (username && password && email && firstname && lastname) {
    connection.query(qs, values, (error, results) => {
      console.log("error", error);
      console.log("results", results);
      if (results.rows.length > 0) {
        request.session.loggedin = true;
        request.session.username = username;
        response.redirect("/");
      } else {
        response.send("Error occur while registering! Contact admin.");
      }
      response.end();
    });
  } else {
    response.send("Please enter complete details!");
    response.end();
  }
});

app.get("/users", function (request: any, response) {
  const qs = "SELECT * FROM users";
  connection.query(qs, (error, results) => {
    console.log("error", error);
    console.log("results", results);
    response.send(results.rows);
    response.end();
  });
});

app.get("/", function (request:any, response) {
  if (request.session.loggedin) {
    response.send("Welcome back, " + request.session.username + "!");
  } else {
    response.send("Please login to view this page!");
  }
  response.end();
});


(async () => {
  await connection.connect();

  app.listen(PORT, () => {
    console.log("Started at http://localhost:%d", PORT);
  });
})();
