const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const firebase = require("firebase");
const { sortAndDeduplicateDiagnostics } = require("typescript");

const firebaseConfig = {
  apiKey: "AIzaSyAzS8MmxAoTIZkh5hDj5kaEyIURWNpO3_w",
  authDomain: "pufs-f13d7.firebaseapp.com",
  projectId: "pufs-f13d7",
  storageBucket: "pufs-f13d7.appspot.com",
  messagingSenderId: "1067723588014",
  appId: "1:1067723588014:web:6c5d531b3baa2fd4f7083f",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();
const docRef = db.collection("users").doc("alovelace");
// Initialize Firebase

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

// Firebase

const posts = [
  {
    username: "Kyle",
    title: "Post 1",
  },
  {
    username: "Jim",
    title: "Post 2",
  },
];

app.get("/api/posts", authenticateToken, async (req, res) => {
  console.log("posts requested");
  // const docRef = db.collection("users").doc("alovelace");

  // await docRef.set({
  //   first: "Ada",
  //   last: "Lovelace",
  //   born: 1815,
  // });
  // console.log("data send");
  // console .log(req);
  console.log(req.user);
  res.json(posts.filter((post) => post.username === req.user.name));
});

function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    console.log(err);
    if (err) return res.sendStatus(403);

    req.user = user;
    console.log(req.user, "extracted from token");
    next();
  });
}

let refreshTokens = [];

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/api/login", (req, res) => {
  // Authenticate User

  const { email, password } = req.body;
  console.log(email, password);
  const user = { name: email, password: password };
  console.log("user login requested");
  const accessToken = generateAccessToken(user);
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  res.json({ accessToken: accessToken, refreshToken: refreshToken });
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "60m" });
}

app.listen(3000);
