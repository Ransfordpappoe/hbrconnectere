const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notificationConroller');

router.post('/', notificationController.handleNotification);
module.exports = router;