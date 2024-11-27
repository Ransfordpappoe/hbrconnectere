const {db} = require('../model/firebaseAdmin');
const bcrypt = require('bcrypt');

const handleUpdateAccount = async (req, res) => {
    const {userName, user_email, password, profile_pic, bio, api_key} = req.body;
    if (!userName || !user_email) {
        return res.status(400).json({message: 'Username is required'});
    }

    const connectere_api_key = process.env.CONNECTERE_API_KEY;

    if (api_key !== connectere_api_key) {
        return res.status(401).json({message: "unauthorized"});
    }

    try {
        const encryptedPwd = password && password != "" ? await bcrypt.hash(password, 10) : "";
        const sanitizeEmail = user_email.replace(/[^a-zA-Z0-9]/g, '');
        const user_ref = db.ref(`User Account/${sanitizeEmail}`);
        const snapshot = await user_ref.once('value');
        if (!snapshot.exists()) {
            //migrate old user information into new users database reference
            await user_ref.set({
                userName,
                user_email,
                password : password ? encryptedPwd : "",
                profile_pic: profile_pic ? profile_pic : "",
                bio: bio ? bio : ""
            });
        }else{
            await user_ref.update({
                userName,
                profile_pic: profile_pic ? profile_pic : "",
                bio: bio ? bio : ""
            });
        }

        res.status(201).json({success: `Account for ${userName} is successfully updated`});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
module.exports = {handleUpdateAccount};