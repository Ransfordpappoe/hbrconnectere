const { admin, firestore } = require("../model/firebaseAdmin");

const collectionPath = process.env.COLLECTION_PATH;
// const collectionPath = "notificationtest";
const connectere_api_key = process.env.CONNECTERE_API_KEY;

const handleBlogsNotification = async(req, res)=>{
    const {title, text, imageUrl, postID, topic, user_email, username, sendToFirestore, docID, api_key} = req.body;
    if (!title || !text || !topic || !user_email || !username || !sendToFirestore || !docID) {
        return res.status(409).json({message: "title, text, user_email, doc id and username are required"});
    }

    if (api_key !== connectere_api_key) {
        return res.status(401).json({message: "unauthorized"});
    }
  
    try {
        const message = {
            data: {
                title,
                text,
                imageUrl,
                docID,
                itemID: postID,
                username,
                user_email,
                targetActivity: "divine_blogs_single_feed"
            },
            topic: topic,
        };

        await admin.messaging().send(message);
        
        if (sendToFirestore === "yes") {
            await firestore.collection(collectionPath).doc(docID).set({
                docID,
                topic,
                title: title,
                body: text,
                imageUrl: imageUrl,
                postID: postID,
                user_email,
                targetActivity: "divine_blogs_single_feed",
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        }
        res.status(201).json({success: `successfully sent message`});


    } catch (error) {
        res.status(500).json({error: `Notification failed: ${error.message}`})
    }
}

const handleGeneralChatsNotification = async(req, res)=>{
    const {title, text, imageUrl, topic, username, user_email, sendToFirestore, docID, api_key} = req.body;
    if (!title || !text || !topic || !sendToFirestore || !docID) {
        return res.status(409).json({message: "title, text, user_email, doc id and topic for notification are required"});
    }

    if (api_key !== connectere_api_key) {
        return res.status(401).json({message: "unauthorized"});
    }
    
    try {
        const message = {
            data: {
                title,
                text,
                imageUrl,
                itemID: "",
                docID,
                username,
                user_email,
                targetActivity: "chat_room"
            },
            topic: topic,
        };

        await admin.messaging().send(message);
        if (sendToFirestore === "yes") {
            await firestore.collection(collectionPath).doc(docID).set({
                docID,
                topic,
                title: title,
                body: text,
                imageUrl: imageUrl,
                postID: "",
                user_email,
                targetActivity: "chat_room",
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        }
        res.status(201).json({success: `chat broadcast successful`});
    } catch (error) {
        res.status(500).json({error: `Notification failed: ${error.message}`})
    }
}

const handleDevNotification = async(req, res)=>{
    const {title, text, imageUrl, topic, username, user_email, sendToFirestore, docID, api_key} = req.body;
    if (!title || !text || !topic || !user_email || !sendToFirestore || !docID) {
        return res.status(409).json({message: "title, text, user_email, doc id and topic for notification are required"});
    }
    if (api_key !== connectere_api_key) {
        return res.status(401).json({message: "unauthorized"});
    }

    try {
        const message = {
            data: {
                title,
                text,
                imageUrl,
                itemID: "",
                docID,
                username,
                user_email,
                targetActivity: "main_activity"
            },
            topic: topic,
        };

        await admin.messaging().send(message);
        if (sendToFirestore === "yes") {
            await firestore.collection(collectionPath).doc(docID).set({
            docID,
            topic,
            title: title,
            body: text,
            imageUrl: imageUrl,
            postID: "",
            user_email,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });   
        }
        res.status(201).json({success: `successfully sent message`});
    } catch (error) {
        res.status(500).json({error: `Notification failed: ${error.message}`})
    }
}

const handleBooksNotification = async(req, res)=>{
    const {title, text, imageUrl, bookTitle, topic, username, user_email, sendToFirestore, docID, api_key} = req.body;
    if (!title || !text || !topic || !bookTitle || !sendToFirestore || !docID) {
        return res.status(409).json({message: "title, text, book title, docID and topic for notification are required"});
    }

    if (api_key !== connectere_api_key) {
        return res.status(401).json({message: "unauthorized"});
    }

    try {
        const message = {
            data: {
                title,
                text,
                imageUrl,
                itemID: "",
                docID,
                bookTitle,
                username,
                user_email,
                targetActivity: "books"
            },
            topic: topic,
        };

        await admin.messaging().send(message);
        if (sendToFirestore === "yes") {
            await firestore.collection(collectionPath).doc(docID).set({
                docID,
                topic,
                title: title,
                body: text,
                imageUrl: imageUrl,
                postID: "",
                user_email,
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        }
        res.status(201).json({success: `successfully sent notification on ${bookTitle}`});
    } catch (error) {
        res.status(500).json({error: `Notification failed: ${error.message}`})
    }
}

const handleAudioBooksNotification = async(req, res)=>{
    const {title, text, imageUrl, audioBookID, topic, username, user_email, sendToFirestore, docID, api_key} = req.body;
    if (!title || !text || !topic || !audioBookID || !sendToFirestore || !docID) {
        return res.status(409).json({message: "title, text, audio book id and topic for notification are required"});
    }

    if (api_key !== connectere_api_key) {
        return res.status(401).json({message: "unauthorized"});
    }

    try {
        const message = {
            data: {
                title,
                text,
                imageUrl,
                itemID: audioBookID,
                docID,
                username,
                user_email,
                targetActivity: "audio_books"
            },
            topic: topic,
        };

        await admin.messaging().send(message);
        if (sendToFirestore === "yes") {
            await firestore.collection(collectionPath).doc(docID).set({
                docID,
                topic,
                title: title,
                body: text,
                imageUrl: imageUrl,
                postID: audioBookID,
                user_email,
                targetActivity: "audio_books",
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        }
        res.status(201).json({success: "successfully sent notification"});
    } catch (error) {
        res.status(500).json({error: `Notification failed: ${error.message}`})
    }
}

const handleHrmwMessagesNotification = async(req, res)=>{
    const {title, text, imageUrl, messageID, topic, username, user_email, sendToFirestore, docID, api_key} = req.body;
    if (!title || !text || !topic || !messageID || !sendToFirestore || !docID) {
        return res.status(409).json({message: "title, text, mesage id, doc id and topic for notification are required"});
    }

    if (api_key !== connectere_api_key) {
        return res.status(401).json({message: "unauthorized"});
    }

    try {
        const message = {
            data: {
                title,
                text,
                imageUrl,
                itemID: messageID,
                docID,
                username,
                user_email,
                targetActivity: "hrmw_messages"
            },
            topic: topic,
        };

        await admin.messaging().send(message);
        if (sendToFirestore === "yes") {
            await firestore.collection(collectionPath).doc(docID).set({
                docID,
                topic,
                title: title,
                body: text,
                imageUrl: imageUrl,
                postID: messageID,
                user_email,
                targetActivity: "hrmw_messages",
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        }
        res.status(201).json({success: `successfully sent message`});
    } catch (error) {
        res.status(500).json({error: `Notification failed: ${error.message}`})
    }
}

const handleReviewsNotification = async(req, res)=>{
    const {title, text, imageUrl, reviewID, bookTitle, topic, username, user_email, sendToFirestore, docID, api_key} = req.body;
    if (!title || !text || !topic || !reviewID || !bookTitle || !sendToFirestore || !docID) {
        return res.status(409).json({message: "title, text, review id, book title, doc id and topic for notification are required"});
    }

    if (api_key !== connectere_api_key) {
        return res.status(401).json({message: "unauthorized"});
    }

    try {
        const message = {
            data: {
                title,
                text,
                imageUrl,
                itemID: reviewID,
                docID,
                bookTitle,
                username,
                user_email,
                targetActivity: "reviews"
            },
            topic: topic,
        };

        await admin.messaging().send(message);
        if (sendToFirestore === "yes") {
            await firestore.collection(collectionPath).doc(docID).set({
                docID,
                topic,
                title: title,
                body: text,
                imageUrl: imageUrl,
                postID: reviewID,
                user_email,
                targetActivity: "reviews",
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        }
        res.status(201).json({success: `successfully sent message`});
    } catch (error) {
        res.status(500).json({error: `Notification failed: ${error.message}`})
    }
}

const handleQuizNotification = async(req, res)=>{
    const {title, text, imageUrl, topic, username, user_email, sendToFirestore, docID, api_key} = req.body;
    if (!title || !text || !topic || !sendToFirestore || !docID) {
        return res.status(409).json({message: "title, text, doc id and topic are required"});
    }

    if (api_key !== connectere_api_key) {
        return res.status(401).json({message: "unauthorized"});
    }

    try {
        const message = {
            data: {
                title,
                text,
                imageUrl,
                itemID: "",
                docID,
                username,
                user_email,
                targetActivity: "bible_quiz"
            },
            topic: topic,
        };

        await admin.messaging().send(message);
        if (sendToFirestore === "yes") {
            await firestore.collection(collectionPath).doc(docID).set({
                docID,
                topic,
                title: title,
                body: text,
                imageUrl: imageUrl,
                postID: "",
                user_email,
                targetActivity: "bible_quiz",
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        }
        res.status(201).json({success: `successfully sent message`});
    
    } catch (error) {
        res.status(500).json({error: `Notification failed: ${error.message}`})
    }
}
const handleTvNotification = async(req, res)=>{
    const {title, text, imageUrl, topic, username, user_email, sendToFirestore, docID, api_key} = req.body;
    if (!title || !text || !topic || !sendToFirestore || !docID) {
        return res.status(409).json({message: "title, text, doc id and topic are required"});
    }
    if (api_key !== connectere_api_key) {
        return res.status(401).json({message: "unauthorized"});
    }

    try {
        const message = {
            data: {
                title,
                text,
                imageUrl,
                itemID: "",
                docID,
                username,
                user_email,
                targetActivity: "holiness_tv"
            },
            topic: topic,
        };

        await admin.messaging().send(message);
        if (sendToFirestore === "yes") {
            await firestore.collection(collectionPath).doc(docID).set({
                docID,
                topic,
                title: title,
                body: text,
                imageUrl: imageUrl,
                postID: "",
                user_email,
                targetActivity: "holiness_tv",
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        }
        res.status(201).json({success: `successfully sent message`});
    } catch (error) {
        res.status(500).json({error: `Notification failed: ${error.message}`})
    }
}
const handleShortsNotification = async(req, res)=>{
    const {title, text, imageUrl, topic, shortVidID, username, user_email, sendToFirestore, docID, api_key} = req.body;
    if (!title || !text || !topic || !sendToFirestore || !docID) {
        return res.status(409).json({message: "title, text, doc id and topic are required"});
    }

    if (api_key !== connectere_api_key) {
        return res.status(401).json({message: "unauthorized"});
    }

    try {
        const message = {
            data: {
                title,
                text,
                imageUrl,
                itemID: shortVidID,
                docID,
                username,
                user_email,
                targetActivity: "short_videos"
            },
            topic: topic,
        };

        await admin.messaging().send(message);
        if (sendToFirestore === "yes") {
            await firestore.collection(collectionPath).doc(docID).set({
                docID,
                topic,
                title: title,
                body: text,
                imageUrl: imageUrl,
                postID: shortVidID,
                user_email,
                targetActivity: "short_videos",
                timestamp: admin.firestore.FieldValue.serverTimestamp()
            });
        }
        res.status(201).json({success: `successfully sent message`});
    
    } catch (error) {
        res.status(500).json({error: `Notification failed: ${error.message}`})
    }
}

module.exports = {handleBlogsNotification,handleGeneralChatsNotification,handleDevNotification,handleBooksNotification,handleAudioBooksNotification,handleHrmwMessagesNotification,handleReviewsNotification,handleQuizNotification,handleTvNotification,handleShortsNotification};