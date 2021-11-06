const express = require("express");
const bodyParser = require("body-parser");
const hbs = require("hbs");
require("dotenv").config();

var serviceAccount = require("./key.json");

var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

let db = admin.firestore();

const app = express();

app.set("view engine", "hbs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

app.get("/", function (req, res) {
  res.render("index");
});

app.get("/contact", function (req, res) {
  res.render("contact");
});

app.get("/blog", async function (req, res) {
  const blogs = db.collection("blogs");
  const snapshot = await blogs.get()
  var data = []
  snapshot.forEach(doc => {
    data.push(doc.data())
  });
  res.render("blog", {data:data});
});

app.post("/blog", async function (req, res) {
  let docRef = db.collection("blogs").doc();
  await docRef.set({
    title: req.body.title,
    url: req.body.url,
    content: req.body.content,
  });
  res.redirect("/blog");
});

app.post("/postUserDetails", function (req, res) {
  let docRef = db.collection("userDetails").doc();

  docRef.set({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message,
  });
});

app.listen(process.env.PORT||3000, function () {
  console.log("Server started on port 3000");
});
