const {db} = require('../model/firebaseAdmin');

const handleUpdateAccount = async (req, res) => {
    const {userName, user_email, password, profile_pic, bio} = req.body;
    if (!userName || !user_email) {
        return res.status(400).json({message: 'Username is required'});
    }

    try {
        const sanitizeEmail = user_email.replace(/[^a-zA-Z0-9]/g, '');
        const user_ref = db.ref(`User Account/${sanitizeEmail}`);
        const snapshot = await user_ref.once('value');
        if (!snapshot.exists()) {
            //migrate old user information into new users database reference
            await user_ref.set({
                userName,
                user_email,
                password : password != null ? password : "",
                profile_pic: profile_pic != null ? profile_pic : ""
            });
        }else{
            await user_ref.update({
                userName,
                profile_pic: profile_pic != null ? profile_pic : "",
                bio: bio != null ? bio : ""
            });
        }

        res.status(201).json({success: `Account for ${userName} is successfully updated`});
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
module.exports = {handleUpdateAccount};