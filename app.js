//jshint esversion:6
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");
const encrypt = require("mongoose-encryption");
const md5 = require("md5");
const sees
const bcrypt = require("bcrypt");

const saltRounds = 10;

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/userdb", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// userSchema.plugin(encrypt, {
//   secret: SERECT,
//   encryptedFields: ["password"],
// });

const User = new mongoose.model("user", userSchema);

/////////////////////////////////////////////// GET ////////////////////////////////////////////////////////////////

app.get("/", function (req, res) {
  res.render("home");
});

app.get("/login", function (req, res) {
  res.render("login");
});

app.get("/register", function (req, res) {
  res.render("register");
});

/////////////////////////////////////////////// POST ///////////////////////////////////////////////////////////////

app.post("/register", function (req, res) {
  bcrypt.hash(req.body.password, saltRounds, function (err, hash) {
    const newUser = User({
      email: req.body.username,
      // password: md5(req.body.password)
      password: hash,
    });

    newUser.save(function (err) {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });
});

app.post("/login", function (req, res) {
  User.findOne(
    {
      email: req.body.username,
    },
    function (err, foundUser) {
      if (!err) {
        if (foundUser) {
          bcrypt.compare(req.body.password, foundUser.password, function (
            err,
            result
          ) {
            if (result == true) {
              res.render("secrets");
            }
          });
          // if (foundUser.password === md5(req.body.password)) {
          //   res.render("secrets");
          // }
        }
      } else {
        console.log(err);
      }
    }
  );
});

console.log(md5("qwerty"));

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
