const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notificationConroller');

router.post('/quiz', notificationController.handleQuizNotification);
router.post('/tv', notificationController.handleTvNotification);
router.post('/messages', notificationController.handleHrmwMessagesNotification);
router.post('/dev', notificationController.handleDevNotification);
module.exports = router;