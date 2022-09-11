const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");
const crypto = require("crypto");
const db = getFirestore();

const shareUserData = async (req, res) => {
  console.log("userdata requested");
  console.log(req["user"]);
  let { puf_token } = req.user;
  let { name } = req.user;

  //get data from firestore
  console.log(puf_token, "doc   token");
  let userData = {};
  let userRef = "";
  if (puf_token) {
    userRef = db.collection("users").doc(puf_token);
  } else {
    userRef = db.collection("users").doc(name);
  }

  let doc = await userRef.get();
  if (doc === undefined) {
    const pufRef = db.collection("users").doc(req.user["puf_token"]);
    doc = await pufRef.get();
    console.log(doc.data(), "got this doc");
  }
  console.log(doc.data(), "this doc");
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
};

module.exports = {
  shareUserData,
};
