const {db} = require('../model/firebaseAdmin');
const bcrypt = require('bcrypt');

const handleLogin = async (req, res) => {
    const {user_email, password} = req.body;
    if (!user_email || !password) {
        return res.status(400).json({message: 'email, and password are required'});
    }

    try {
        const sanitizeEmail = user_email.replace(/[^a-zA-Z0-9]/g, '');
        const user_ref = db.ref(`User Account/${sanitizeEmail}`);
        const snapshot = await user_ref.once('value');
        if (!snapshot.exists()) {
            return res.status(404).json({message:"user not found"});
        }
        
        const userData = snapshot.val();
        const verifiedPwd = await bcrypt.compare(password, userData?.password);
        if (verifiedPwd) {
            res.status(201).json({
                profile_pic: userData.profile_pic,
                userName: userData.userName,
                bio: userData.bio != null ? userData.bio : ""
            });
        //    return res.status(201).json({success: `Login successful`});
        }else{
            return res.status(401).json({message:"incorrect password"});
        }

    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
module.exports = {handleLogin};