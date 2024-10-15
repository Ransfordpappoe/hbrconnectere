const {db} = require('../model/firebaseAdmin');
const bcrypt = require('bcrypt');

const handleChangePassword = async (req, res) => {
    const {user_email, password, api_key} = req.body;
    if (!user_email || !password) {
        return res.status(400).json({message: 'email and password are required'});
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
            return res.status(404).json({message:"User not found. Failed to change password"});
        }
        const encryptedPwd = await bcrypt.hash(password, 10);

        await user_ref.update({
            password: encryptedPwd,
        });
        res.status(201).json({success: `password for ${user_email} is updated`});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
module.exports = {handleChangePassword};