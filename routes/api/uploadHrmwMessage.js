const express = require('express');
const router = express.Router();
const hrmwMessagesController = require('../../controllers/hrmwMessagesController');

router.post('/', hrmwMessagesController.handleUploadMessage);
module.exports = router;