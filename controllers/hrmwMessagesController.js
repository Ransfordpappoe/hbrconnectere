const { format } = require('date-fns');
const {db} = require('../model/firebaseAdmin');

const generateRandomID = ()=>{
    const timeConstraint = format(new Date(), "yyyyMMdd");
    const randNumber = Math.floor(Math.random() * 1000000);
    const alphabets = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let appendRandLetters = "";
    for(let i=0; i < 5; i++){
      const randLetter = alphabets.charAt(Math.random() * alphabets.length);
      appendRandLetters += randLetter;
    }
    const randId = `${timeConstraint}${randNumber}${appendRandLetters}`;
    return randId;
}

const handleUploadMessage = async (req, res) => {
    const {genre, thumbnail, title, url, videoUrl, preacher, description, user_email, api_key} = req.body;

    const connectere_api_key = process.env.CONNECTERE_API_KEY;

    if (api_key !== connectere_api_key) {
        return res.status(401).json({message: "unauthorized"});
    }

    try {
        const sanitizeEmail = user_email.replace(/[^a-zA-Z0-9]/g, '');
        const user_ref = db.ref(`User Account/${sanitizeEmail}/status`);
        const snapshot = await user_ref.once('value');
        if (!snapshot.exists() || snapshot.val() !== process.env.ADMIN_CODE) {
            return res.status(409).json({message: "you are not authorized to upload messages"});
        }
        // const doesMessageExist = await db.ref(`hrmw_messages_titles`).orderByChild('title').replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase().equalTo(incomingMessageTitle).once('value');
        
        const messageId = generateRandomID();
        const messagesRef = db.ref(`hrmw_messages/${messageId}`);
        const messageTitlesRef = db.ref(`hrmw_messages_titles/${messageId}`);
        const date = format(new Date(), "yyyy-MM-dd");

        await messagesRef.set({
            id: messageId,
            date,
            genre,
            thumbnail,
            title,
            url,
            videoUrl,
            preacher,
            description,
            uploadBy: sanitizeEmail
        });
        await messageTitlesRef.set({
            id: messageId,
            title,
            genre
        });
        return res.status(201).json({success: `successfully uploaded ${title}`});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}

const handleUpdateMessage = async(req, res)=>{
    const {genre, thumbnail, title, url, videoUrl,messageId, preacher,description, user_email, api_key} = req.body;

     const connectere_api_key = process.env.CONNECTERE_API_KEY;

    if (!messageId && messageId === "") {
        return res.status(400).json({message: "message id is required"});
    }
    if (api_key !== connectere_api_key) {
        return res.status(401).json({message: "unauthorized"});
    }
    const sanitizeEmail = user_email.replace(/[^a-zA-Z0-9]/g, '');
        const user_ref = db.ref(`User Account/${sanitizeEmail}/status`);
        const snapshot = await user_ref.once('value');
        if (!snapshot.exists() || snapshot.val() !== process.env.ADMIN_CODE) {
            return res.status(409).json({message: "you are not authorized to update messages"});
    }

    try {
        const messagesRef = db.ref(`hrmw_messages/${messageId}`);

        const updateData = {};
        if (genre) updateData.genre = genre;
        if (thumbnail) updateData.thumbnail = thumbnail;
        if (title) updateData.title = title;
        if (url) updateData.url = url;
        if (videoUrl) updateData.videoUrl = videoUrl;
        if (preacher) updateData.preacher = preacher;
        if (description) updateData.description = description;

        await messagesRef.update(updateData);
        return res.status(201).json({success: `successfully updated`});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
}
module.exports = {handleUploadMessage, handleUpdateMessage};