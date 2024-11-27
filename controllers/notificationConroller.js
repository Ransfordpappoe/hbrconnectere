const { admin, firestore } = require("../model/firebaseAdmin");
const { format } = require("date-fns");


const handleNotification = async(req, res)=>{
    const {title, text, imageUrl, postID, topic, user_email, api_key} = req.body;
    if (!title || !text || !topic || !user_email) {
        return res.status(409).json({message: "title, text, user_email and topic for notification are required"});
    }

    const connectere_api_key = process.env.CONNECTERE_API_KEY;

    if (api_key !== connectere_api_key) {
        return res.status(401).json({message: "unauthorized"});
    }

    try {
        const message = {
            notification: {
                title: title,
                body: text,
                imageUrl: imageUrl,
            },
            data: {
                postID
            },
            topic: topic,
        };

        const response = await admin.messaging().send(message);
        res.status(201).json({success: `successfully sent message: ${response}`});
        // const collectionPath = process.env.COLLECTION_PATH;
        const collectionPath = "notificationtest";
        const docID = format(new Date(), "yyyyMMddHHmmss");
        await firestore.collection(collectionPath).doc(docID).set({
            docID,
            topic,
            title: title,
            body: text,
            imageUrl: imageUrl,
            postID: postID,
            user_email,
            timestamp: admin.firestore.FieldValue.serverTimestamp()
        });

    } catch (error) {
        res.status(500).json({error: `Notification failed: ${error.message}`})
    }
}
module.exports = {handleNotification};