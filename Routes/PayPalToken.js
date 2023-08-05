const express = require("express");
const router = express.Router();
const paypalController = require("../Controllers/PaypalController");

router.post("/getAccessToken", paypalController.getAccessToken);

module.exports = router;
