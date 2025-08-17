const {db} = require('../model/firebaseAdmin');
const bcrypt = require('bcrypt');

const handleUpdateAccount = async (req, res) => {
    const {userName, user_email, password, profile_pic, bio, status, api_key} = req.body;
    if (!user_email) {
        return res.status(400).json({message: 'Username is required'});
    }

    const connectere_api_key = process.env.CONNECTERE_API_KEY;

    if (api_key !== connectere_api_key) {
        return res.status(401).json({message: "unauthorized"});
    }

    try {
        const sanitizeEmail = user_email.replace(/[^a-zA-Z0-9]/g, '');
        const user_ref = db.ref(`User Account/${sanitizeEmail}`);
        const snapshot = await user_ref.once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({message: "user not found"});
        }
        const updateProfile = {};
        if (userName) updateProfile.userName = userName;
        if (profile_pic) updateProfile.profile_pic = profile_pic;
        if (bio) updateProfile.bio = bio;
        if (status) updateProfile.status = status
        await user_ref.update(updateProfile);

        return res.status(201).json({success: `${userName ? `Account for ${userName}`:'Your account'} is successfully updated`});
    } catch (error) {
        return res.status(500).json({message: error.message});
    }
};
module.exports = {handleUpdateAccount};