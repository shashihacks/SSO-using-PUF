const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

const firebase = require("firebase");
const { sortAndDeduplicateDiagnostics } = require("typescript");
const { response } = require("express");

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

app.post("/api/login", async (req, res) => {
  // Authenticate User

  const { email, password } = req.body;
  console.log(email, password);
  const user = { name: email, password: password };
  console.log("user login requested");

  let userExists = await accountExists(user);
  console.log(userExists, "executed");
  if (userExists) {
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.status(200).send({
      accessToken: accessToken,
      refreshToken: refreshToken,
      text: "Login Success",
    });
  } else {
    res.send({ text: "Invalid Email or Password" });
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "60m" });
}

async function accountExists(user) {
  //check from db
  console.log(user, "checking user");
  const { name: email, password } = user;
  const userRef = db.collection("users").doc(email.toString());
  const doc = await userRef.get();
  if (!doc.exists) {
    console.log("No such document!");
    return false;
  } else {
    console.log("Document data:", doc.data());
    const { email: dbEmail, password: dbPassword } = doc.data();
    if (dbEmail == email && dbPassword == password) return true;
    else return false;
  }
}

// PUF Login

app.post("/api/login-with-puf", async (req, res) => {
  // Authenticate User

  const { puf_token } = req.body;
  console.log(puf_token);
  const { username } = generateUsername();
  console.log(username, "generated for user");
  const user = { name: username, puf_token: puf_token };
  console.log("user login requested with PUF");

  if (tokenExists(puf_token)) {
    // let accountDetails = getAccount(puf_token);
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({
      accessToken: accessToken,
      refreshToken: refreshToken,
    });
  } else {
    let registrationResponse = await registerAccount(puf_token);
    if (registrationResponse) {
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      refreshTokens.push(refreshToken);
      res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        accountDetails,
      });
    } else {
      res.send({ text: "Unable to create account" });
    }
  }
});

function generateUsername() {
  let username = "user_" + (Math.random() + 1).toString(36).substring(5);
  return username;
}

async function tokenExists(puf_token) {
  const userRef = db.collection("users").doc(puf_token.toString());
  const doc = await userRef.get();
  if (!doc.exists) {
    console.log("No such document!");
    return false;
  } else {
    console.log("Document data:", doc.data());

    return doc.data();
  }
}

async function registerAccount(puf_token) {
  const data = {
    pufToken: puf_token,
    email: "",
    firstName: generateUsername(),
    phone: "",
  };

  console.log(puf_token, data);
  const userRef = db.collection("users").doc(puf_token.toString());
  const res = await userRef.set(data);

  // setTimeout(() => {
  //   console.log(res, "response from register Account");
  // }, 3000);
  if (res) return true;
}
app.listen(3000);
