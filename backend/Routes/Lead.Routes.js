const express = require("express");

const router = express.Router();

const { getCurrentLead } = require("../Controllers/Lead.Contrller");

router.get("/:sessionId", getCurrentLead);

module.exports = router;