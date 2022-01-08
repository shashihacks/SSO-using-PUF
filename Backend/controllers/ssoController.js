const {
  getFirestore,
  Timestamp,
  FieldValue,
} = require("firebase-admin/firestore");

const db = getFirestore();

const shareUserData = async (req, res) => {
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
};

module.exports = {
  shareUserData,
};
