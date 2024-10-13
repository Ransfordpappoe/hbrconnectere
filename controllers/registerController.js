const {db} = require('../model/firebaseAdmin');
const bcrypt = require('bcrypt');

const handleCreateAccount = async (req, res) => {
    const {userName, user_email, password, profile_pic} = req.body;
    if (!userName || !user_email || !password) {
        return res.status(400).json({message: 'Username, email, and password are required'});
    }

    try {
        const sanitizeEmail = user_email.replace(/[^a-zA-Z0-9]/g, '');
        const user_ref = db.ref(`User Account/${sanitizeEmail}`);
        const snapshot = await user_ref.once('value');
        if (snapshot.exists()) {
            return res.sendStatus(409); 
        }
        const encryptedPwd = await bcrypt.hash(password, 10);

        await user_ref.set({
            userName,
            user_email,
            password: encryptedPwd,
            profile_pic: profile_pic != null ? profile_pic : ""
        });
        res.status(201).json({success: `Account for ${userName} is created`});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
module.exports = {handleCreateAccount};