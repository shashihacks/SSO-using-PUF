const express = require("express");
const router = express.Router();
var authenticator = require("../middlewares/tokenAuthenticate");
const authenticateToken = authenticator.authenticateToken;

const ssoController = require("../controllers/ssoController");

//Custom data for SSO
//sso-userdata == api/sso/share-userdata
router.post("/share-userdata", authenticateToken, ssoController.shareUserData);

module.exports = router;
