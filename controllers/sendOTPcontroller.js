const nodemailer = require("nodemailer");
const dns = require("dns");

function checkMxRecords(domain) {
  return new Promise((resolve, reject) => {
    dns.resolveMx(domain, (err, addresses) => {
      if (err) {
        reject(err);
      } else {
        resolve(addresses && addresses.length > 0);
      }
    });
  });
}

async function isEmailDomainValid(email) {
  const domain = email.split("@")[1];
  try {
    const hasMxRecords = await checkMxRecords(domain);
    return hasMxRecords;
  } catch {
    return false;
  }
}

const generateOtpCode = () => {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
};

const sendVerificationCode = async (req, res) => {
  try {
    const { email, messageBody, messageTitle } = req.body;
    if (!email || !messageBody || !messageTitle) {
      return res
        .status(400)
        .json({ message: "email, messageBody and messageTitle are required" });
    }

    const isDomainValid = await isEmailDomainValid(email);
    if (!isDomainValid) {
      return res.status(401).json({ message: "inivalid email" });
    }

    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.DELIVERY_EMAIL,
        pass: process.env.APPPWD,
      },
      ssl: {
        rejectUnauthorized: false,
      },
    });

    const otp = generateOtpCode();

    const htmlTemplate = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Horemow Book Reader One-Time-Password</title>
                <style>
                    .email-container {
                        max-width: 600px;
                        margin: 0 auto;
                        font-family: Arial, sans-serif;
                        line-height: 1.6;
                        color: #333333;
                    }
                    .header {
                        background-color: #f8f9fa;
                        padding: 20px;
                        text-align: center;
                    }
                    .content {
                        padding: 20px;
                    }
                    .message-docs {
                        max-width: 100%;
                        height: auto;
                        margin: 20px 0;
                    }
                    .footer {
                        background-color: #f8f9fa;
                        padding: 20px;
                        text-align: center;
                        font-size: 12px;
                    }
                    .cta-button {
                        display: inline-block;
                        padding: 10px 20px;
                        background-color: #808080;
                        color: #ffffff;
                        text-decoration: none;
                        border-radius: 999px;
                        margin: 20px 0;
                        text-decoration: none;
                    }
                </style>
            </head>
            <body>
                <div class="email-container">
                    <div class="header">
                    <h1>Horemow Book Reader One-Time-Password</h1>
                    </div>
                    <div class="content">
                        <p>${messageBody} Verification code: (${otp})\n\nReport any suspected issue to the horemow book reader app support team here:\n\nhttps://horemowbookreaderlite.web.app/contact</p> <br/>
                        <h3>Verification code: ${otp}</h3>
                    </div>
                    <div class="footer">
                        <p>© ${new Date().getFullYear()} bethelSoftwareTeam | Horemow Book Reader | All rights reserved.</p>
                    </div>
                </div>
            </body>
            </html>  
        `;

    // transporter.sendMail({
    //   from: {
    //     name: `Horemow Book Reader App`,
    //     address: process.env.DELIVERY_EMAIL,
    //   },
    //   to: email,
    //   subject: messageTitle,
    //   html: htmlTemplate,
    //   replyTo: process.env.DELIVERY_EMAIL,
    // });
    transporter.sendMail({
      from: {
        name: `Horemow Book Reader App`,
        address: "no-reply@horemowbookreader.mooo.com",
      },
      to: email,
      subject: messageTitle,
      text: `Hello, Your verification code is ${otp}. If you did not request this, you can ignore this message. \n\n
      © ${new Date().getFullYear()} Horemow Book Reader | BethelSoftwareTeam | All rights reserved.`,
      html: htmlTemplate,
      replyTo: "support@horemowbookreader.mooo.com",
    });

    return res.status(201).json({
      vcode: otp,
    });
  } catch (error) {
    return res
      .status(500)
      .json({ error: `Email notification failed: ${error}` });
  }
};
module.exports = { sendVerificationCode };
