const express = require('express');
const router = express.Router();

router.use("/books",require("./booksNotification"));
router.use("/blogs",require("./blogNotification"));
router.use("/chats",require("./chatsNotification"));
router.use("/other",require("./otherNotifications"));
module.exports = router;