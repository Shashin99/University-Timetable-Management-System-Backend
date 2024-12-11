const nodemailer = require("nodemailer");

const sendNotificationAlert = async (title, message, email) => {
    try {
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "sansaluclothing@gmail.com",
                pass: "nfnaeiiwwbgzjmym",
            },
        });

        var mailOptions = {
            from: "sansaluclothing@gmail.com",
            to: email,
            subject: title,
            text: message,
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                res.status(500).json({ error: error });
            } else {
                res.status(200).json({
                    message: `Mail Has Been Sent - ${info.response}`,
                });
            }
        });
    } catch (error) {
        console.log(error, error.message);
    }
};

module.exports = {
    sendNotificationAlert,
};
