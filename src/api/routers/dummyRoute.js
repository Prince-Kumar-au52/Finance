const express = require("express");
const { dummyService } = require("../controllers/dummy");
const router = express.Router();

router.get("/getDummy", dummyService);

module.exports = router;
