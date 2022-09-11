const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

const db = getFirestore();

const getUserInfo = async (req, res) => {
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
};

const updateUser = async (req, res) => {
  console.log("hit /updateuser");
  console.log(req.body.user);
  let updateUserObject = req.body.user;

  const { email, pufToken } = req.body.user;
  if (pufToken) {
    await db.collection("users").doc(pufToken).update(updateUserObject);
  } else {
    await db.collection("users").doc(email).update(updateUserObject);
  }
  res.send({ sendStatus: 201, text: "User update success" });
};

const auth = async (req, res) => {
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
};

const updateAuth = async (req, res) => {
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
};

const addApp = async (req, res) => {
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
};

const getApps = async (req, res) => {
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
};

const updateApp = async (req, res) => {
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
};

const deleteApp = async (req, res) => {
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
          "settings.applications": FieldValue.arrayRemove(appData),
        },
        { merge: true }
      )
      .then(() => {
        res.send({ sendStatus: 201, text: "Delete success" });
      });

    console.log(response2, "response");
  }
};

const deletAccount = (req, res) => {
  console.log("delete account");
};
module.exports = {
  getUserInfo,
  updateUser,
  auth,
  updateAuth,
  addApp,
  getApps,
  updateApp,
  deleteApp,
  deletAccount,
};
