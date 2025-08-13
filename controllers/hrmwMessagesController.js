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
    const {genre, thumbnail, title, url, videoUrl, api_key} = req.body;

    const connectere_api_key = process.env.CONNECTERE_API_KEY;

    // if (api_key !== connectere_api_key) {
    //     return res.status(401).json({message: "unauthorized"});
    // }

    try {
        // const sanitizeEmail = user_email.replace(/[^a-zA-Z0-9]/g, '');
        const messageId = generateRandomID();
        const messagesRef = db.ref(`hrmw_messages/${messageId}`);
        const date = format(new Date(), "yyyy-MM-dd");
        // const snapshot = await user_ref.once('value');
        // if (snapshot.exists()) {
        //     return res.sendStatus(409) 
        // }

        await messagesRef.set({
            id: messageId,
            date,
            genre,
            thumbnail,
            title,
            url,
            videoUrl
        });
        res.status(201).json({success: `successfully uploaded ${title}`});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}

const handleUpdateMessage = async(req, res)=>{
    const {genre, thumbnail, title, url, videoUrl,messageId, preacher, api_key} = req.body;

    //  const connectere_api_key = process.env.CONNECTERE_API_KEY;

    if (!messageId && messageId === "") {
        return res.status(400).json({message: "message id is required"});
    }
    // if (api_key !== connectere_api_key) {
    //     return res.status(401).json({message: "unauthorized"});
    // }

    try {
        const messagesRef = db.ref(`hrmw_messages/${messageId}`);

        const updateData = {};
        if (genre) updateData.genre = genre;
        if (thumbnail) updateData.thumbnail = thumbnail;
        if (title) updateData.title = title;
        if (url) updateData.url = url;
        if (videoUrl) updateData.videoUrl = videoUrl;
        if (preacher) updateData.preacher = preacher;

        await messagesRef.update(updateData);
        res.status(201).json({success: `successfully updated`});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
}
module.exports = {handleUploadMessage, handleUpdateMessage};