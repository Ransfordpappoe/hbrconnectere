const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notificationConroller');

router.post('/divineblogs', notificationController.handleBlogsNotification);
router.post('/divineshorts', notificationController.handleShortsNotification);
module.exports = router;