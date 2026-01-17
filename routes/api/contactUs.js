const express = require("express");
const router = express.Router();
const notificationController = require("../../controllers/notificationConroller");

router.post("/feedback", notificationController.contactUsNotification);
module.exports = router;
