const express = require("express");
const app = express();
const port = 3200;
const firebase = require("firebase");
const db = firebase.initializeApp({
  apiKey: "AIzaSyAzS8MmxAoTIZkh5hDj5kaEyIURWNpO3_w",
  authDomain: "pufs-f13d7.firebaseapp.com",
  projectId: "pufs-f13d7",
  storageBucket: "pufs-f13d7.appspot.com",
  messagingSenderId: "1067723588014",
  appId: "1:1067723588014:web:6c5d531b3baa2fd4f7083f",
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
