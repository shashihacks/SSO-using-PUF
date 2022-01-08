const express = require("express");
const router = express.Router();
var authenticator = require("../middlewares/tokenAuthenticate");
const authenticateToken = authenticator.authenticateToken;

const settingsController = require("../controllers/settingsController");

//userinfo = api/settings/userinfo
router.post("/userinfo", authenticateToken, settingsController.getUserInfo);

//   updateuser == api/settings/profile-update
router.post("/updateuser", authenticateToken, settingsController.updateUser);

//authsettings =  api/settings/auth
router.post("/auth", authenticateToken, settingsController.auth);

// updateauthsettings  = /api/settings/updateauth
router.post("/updateauth", authenticateToken, settingsController.updateAuth);

//add-app === settings/add-app
router.post("/add-app", authenticateToken, settingsController.addApp);

///get-apps === settings/get-apps
router.post("/get-apps", authenticateToken, settingsController.getApps);

router.post("/update-app", authenticateToken, settingsController.updateApp);

///delete-app === settings//delete-app

router.post("/delete-app", authenticateToken, settingsController.deleteApp);

///delete-account == settings/delete-account
router.delete(
  "/delete-account",
  authenticateToken,
  settingsController.deletAccount
);

module.exports = router;
