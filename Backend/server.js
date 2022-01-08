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

//routes
const postRoutes = require("./routes/posts");
// const loginRoutes = require("./routes/login");
const settingsRoutes = require("./routes/settings");
const ssoRoutes = require("./routes/sso");

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

//Post routes
app.use("/api/posts", postRoutes);

// app.use("/token", loginRoutes);

const db = getFirestore();
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

  const userRef = await db.collection("users").doc(puf_token.toString());
  userRef.set(data).then(() => {
    console.log("registed and sent true");
    return true;
  });

  return true;
}

//user routes - settingspage

app.use(["/api/settings"], settingsRoutes);

app.use("/api/sso", ssoRoutes);

app.listen(3000);
