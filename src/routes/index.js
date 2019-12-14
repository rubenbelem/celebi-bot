/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();

router.use("/pokemon", require("./pokemon"));
router.use("/team", require("./team"));

module.exports = router;
