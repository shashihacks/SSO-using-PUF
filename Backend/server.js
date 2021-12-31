const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const {
  initializeApp,
  applicationDefault,
  cert,
} = require("firebase-admin/app");
const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

const serviceAccount = require("./key.json");
initializeApp({
  credential: cert(serviceAccount),
});
const db = getFirestore();

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
    // console.log(req.user, "extracted from token");
    next();
  });
}

let refreshTokens = [];

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken == null) return res.sendStatus(401);
  // if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    const accessToken = generateAccessToken({ name: user.name });
    res.json({ accessToken: accessToken });
  });
});

app.post("/api/logout", (req, res) => {
  console.log(req.body);
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.sendStatus(204);
});

app.post("/api/login", async (req, res) => {
  // Authenticate User

  const { email, password, deviceInfo } = req.body;
  deviceInfo["timestamp"] = Date.now();
  console.log(email, password, deviceInfo);
  const user = { name: email, password: password, deviceInfo };
  // console.log("user login requested");

  let userExists = await accountExists(user);
  // console.log(userExists, "executed");
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
    res.send({ text: "Invalid credentials or Account is disabled" });
  }
});

function generateAccessToken(user) {
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "60h" });
}

async function accountExists(user) {
  const { name: email, password, deviceInfo } = user;

  const userRef = db.collection("users").doc(email.toString());
  const doc = await userRef.get();
  if (!doc.exists) {
    console.log("No such document!");
    return false;
  } else {
    const {
      email: dbEmail,
      password: dbPassword,
      settings: { emailAndPass, pufResponse },
    } = doc.data();
    console.log("settings", emailAndPass, pufResponse);
    if (dbEmail == email && dbPassword == password && emailAndPass) {
      const unionRes = await userRef.update({
        "settings.logins": FieldValue.arrayUnion({
          ...deviceInfo,
        }),
      });
      return true;
    } else return false;
  }
}

// PUF Login

app.post("/api/login-with-puf", async (req, res) => {
  // Authenticate User

  const { puf_token } = req.body;
  console.log(puf_token);
  const username = generateUsername();
  console.log(username, "generated for user");
  const user = { name: username, puf_token: puf_token };
  console.log("user login requested with PUF");
  let accountDetails = await getAccount(puf_token);
  if (accountDetails["pufToken"]) {
    const accessToken = generateAccessToken(user);
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({
      accessToken: accessToken,
      refreshToken: refreshToken,
      // accountDetails,
    });
  } else {
    let registrationResponse = await registerAccount(puf_token);
    if (registrationResponse) {
      console.log("generating token");
      const accessToken = generateAccessToken(user);
      const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
      refreshTokens.push(refreshToken);
      res.json({
        accessToken: accessToken,
        refreshToken: refreshToken,
        // accountDetails,
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

async function getAccount(puf_token) {
  const userRef = await db.collection("users").doc(puf_token);
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
    settings: { emailAndPass: true, pufResponse: true },
  };

  // console.log(puf_token, data);
  const userRef = await db.collection("users").doc(puf_token.toString());
  userRef.set(data).then(() => {
    console.log("registed and sent true");
    return true;
  });

  return true;
  // setTimeout(() => {
  //   console.log(res, "response from register Account");
  // }, 3000);
}

//Custom data for SSO
app.post("/api/sso-userdata", authenticateToken, async (req, res) => {
  console.log("userdata requested");
  console.log(req.user);
  const { name } = req.user;
  //get data from firestore
  let userData = {};
  const userRef = db.collection("users").doc(name);
  const doc = await userRef.get();
  if (!doc.exists) {
    return false;
  } else {
    userData = doc.data();
  }

  const key = "abcdef";
  delete userData["phone"];
  delete userData["password"];
  console.log(userData);
  let myOrderedUserObject = {
    firstName: userData["firstName"],
    lastName: userData["lastName"],
    email: userData["email"],
  };
  let HMAC = crypto
    .createHmac("sha1", key)
    .update(JSON.stringify(myOrderedUserObject))
    .digest("hex");
  console.log(HMAC, "HMac");
  userData["HMAC"] = HMAC;
  res.send(userData);
});

//settingspage
app.post("/api/userinfo", authenticateToken, async (req, res) => {
  console.log("userdata requested");
  console.log(req.user);
  var { name, puf_token } = req.user;
  //get data from firestore
  console.log(name, puf_token, "is name found?");

  // const { puf_token } = req.user;
  if (name == undefined) {
    let { puf_token } = req.user;
    name = puf_token;
  }

  let userData = {};
  let userRef;
  if (puf_token) {
    userRef = await db.collection("users").doc(puf_token);
  } else {
    userRef = await db.collection("users").doc(name);
  }

  const doc = await userRef.get();

  if (!doc.exists) {
    console.log("does'nt exist");
    return false;
  } else {
    userData = doc.data();
  }
  delete userData["password"];
  console.log(userData, "userdata");
  // res.send(userData);
  res.status(200).send(userData);
});

app.post("/api/updateuser", authenticateToken, async (req, res) => {
  console.log("hit /updateuser");
  console.log(req.body.user);
  let updateUserObject = req.body.user;
  const { email } = req.body.user;

  await db.collection("users").doc(email).update(updateUserObject);
  res.send({ sendStatus: 201, text: "User update success" });
});

app.post("/api/authsettings", authenticateToken, async (req, res) => {
  let updateUserObject = req.body.user;
  var { name } = req.user;

  if (name == undefined) {
    let { puf_token } = req.user;
    name = puf_token;
  }

  console.log(req.user, "get settings");
  const userRef = db.collection("users").doc(name);
  const doc = await userRef.get();
  if (!doc.exists) {
    return false;
  } else {
    userData = doc.data();
  }

  console.log(userData);
  if (!userData.settings) {
    console.log("empty settings");
    userData["settings"] = { emailAndPass: true, pufResponse: true };
  }

  console.log("settings", userData.settings);
  res.send({ sendStatus: 200, data: userData.settings });
});

app.post("/api/updateauthsettings", authenticateToken, async (req, res) => {
  let updateUserObject = req.body.user;
  var { name } = req.user;
  if (name == undefined) {
    let { puf_token } = req.user;
    name = puf_token;
  }

  console.log(req.user, "get settings");
  const userRef = db.collection("users").doc(name);
  const doc = await userRef.get();
  console.log(req.body, "received settings");
  if (!doc.exists) {
    res.send({ sendStatus: 404, text: "User not found, update failed" });
    return false;
  } else {
    userData = doc.data();

    // userData["settings"] = req.body["settings"];
    const response = await userRef.update({
      settings: req.body["settings"],
    });

    res.send({ sendStatus: 201, text: "update success" });
  }
});

app.post("/api/add-app", authenticateToken, async (req, res) => {
  let updateUserObject = req.body.user;
  const { name } = req.user;
  console.log(req.user, "get settings");
  const userRef = db.collection("users").doc(name);
  const doc = await userRef.get();
  console.log(req.body, "received settings");
  if (!doc.exists) {
    res.send({ sendStatus: 404, text: "User not found, update failed" });
    return false;
  } else {
    userData = doc.data();
    const response = await userRef.update({
      "settings.applications": FieldValue.arrayUnion(req.body["appData"]),
    });

    res.send({ sendStatus: 200, text: "update success" });
  }
});

app.post("/api/get-apps", authenticateToken, async (req, res) => {
  let updateUserObject = req.body.user;
  const { name } = req.user;
  console.log(req.user, "get settings");
  const userRef = db.collection("users").doc(name);
  const doc = await userRef.get();
  console.log(req.body, "received settings");
  if (!doc.exists) {
    res.send({ sendStatus: 404, text: "User not found, update failed" });
    return false;
  } else {
    userData = doc.data();
    const applications = userData["settings"]["applications"];
    res.send({ sendStatus: 200, data: applications });
  }
});

app.post("/api/update-app", authenticateToken, async (req, res) => {
  const { name } = req.user;
  console.log(req.body.data, "received object");
  const userRef = db.collection("users").doc(name);
  const doc = await userRef.get();
  if (!doc.exists) {
    res.send({ sendStatus: 404, text: "User not found, update failed" });
    return false;
  } else {
    const { index, name, url } = req.body.data;
    let appsCopy = doc.data().settings.applications;
    oldName = appsCopy[index].name;
    oldUrl = appsCopy[index].url;
    appsCopy[index].name = name;
    appsCopy[index].url = url;
    let response = await userRef
      .update(
        {
          "settings.applications": FieldValue.arrayUnion(...appsCopy),
        },
        { merge: true }
      )
      .then(async () => {
        console.log("thennable");
      });

    let response2 = await userRef
      .update(
        {
          "settings.applications": FieldValue.arrayRemove({
            name: oldName,
            url: oldUrl,
          }),
        },
        { merge: true }
      )
      .then(() => {
        res.send({ sendStatus: 200, data: appsCopy, text: "Update success" });
      });
  }
});

app.post("/api/delete-app", authenticateToken, async (req, res) => {
  const { name } = req.user;
  console.log(req.body.data, "received object to delete");
  const userRef = db.collection("users").doc(name);
  const doc = await userRef.get();
  if (!doc.exists) {
    res.send({ sendStatus: 404, text: "User not found, update failed" });
    return false;
  } else {
    const appData = req.body.data;
    console.log(appData);
    // appData["id"] = 2;
    let response2 = await userRef
      .update(
        {
          "settings.applications":
            firebase.firestore.FieldValue.arrayRemove(appData),
        },
        { merge: true }
      )
      .then(() => {
        res.send({ sendStatus: 201, text: "Delete success" });
      });

    console.log(response2, "response");
  }
});

app.delete("/api/delete-account", authenticateToken, async (req, res) => {
  console.log("delete account");
});

app.listen(3000);
