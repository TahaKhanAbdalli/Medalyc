const express = require("express");
const faxService = require("../services/faxService");
const router = express.Router();

router.post("/recieveFaxStatus", faxService.recieveFaxStatus);
router.post("/mockfax", faxService.recieveFax);

module.exports = router;
