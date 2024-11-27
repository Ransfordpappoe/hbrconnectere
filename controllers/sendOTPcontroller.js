const nodemailer = require('nodemailer');
const dns = require('dns');

function checkMxRecords(domain) {
    return new Promise((resolve, reject)=>{
        dns.resolveMx(domain, (err, addresses) =>{
            if (err) {
                reject(err);
            }else{
                resolve(addresses && addresses.length > 0);
            }
        });
    });
}

async function isEmailDomainValid(email) {
    const domain = email.split('@')[1];
    try {
        const hasMxRecords = await checkMxRecords(domain);
        return hasMxRecords;
    } catch{
        return false;
    }
}

const generateOtpCode=()=>{
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
};

const sendVerificationCode = async (req, res)=>{
    const {email, messageBody, messageTitle} = req.body;
    if (!email || !messageBody || !messageTitle) {
        return res.status(400).json({message: 'email, messageBody and messageTitle are required'});
    }

    const isDomainValid = await isEmailDomainValid(email);
    if (!isDomainValid) {
        return res.status(401).json({message: 'inivalid email'});
    }

    let transporter = nodemailer.createTransport({
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: process.env.DEV_MAIL,
            pass: process.env.APPPWD,
        },
        ssl: {
            rejectUnauthorized: false
        }
    });

    const otp = generateOtpCode();

    let mailOptions = {
        from: process.env.DEV_MAIL,
        to: email,
        subject: messageTitle,
        text: `${messageBody} Verification code: (${otp})\n\nReport any suspected issue to the horemow book reader app support team here:\n\nhttps://horemowbookreaderlite.web.app/contact`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.status(201).json({
            vcode: otp
        });
    } catch (error) {
        res.status(500).json({message: error.message});
    }
};
module.exports = {sendVerificationCode};