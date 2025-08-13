const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notificationConroller');

router.post('/generalchats', notificationController.handleGeneralChatsNotification);
module.exports = router;