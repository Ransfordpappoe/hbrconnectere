const express = require('express');
const router = express.Router();
const notificationController = require('../../controllers/notificationConroller');

router.post('/softbooks', notificationController.handleBooksNotification);
router.post('/audiobooks', notificationController.handleAudioBooksNotification);
router.post('/bookreviews', notificationController.handleReviewsNotification);
module.exports = router;