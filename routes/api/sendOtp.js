const express = require('express');
const router = express.Router();
const sendOTPcontoller = require('../../controllers/sendOTPcontroller');

router.post('/', sendOTPcontoller.sendVerificationCode);
module.exports = router;