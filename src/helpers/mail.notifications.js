const nodemailer = require("nodemailer");

const database = require('../startup/db');

let { FAIL, SUCCESS, SOME_THONG_WENTWRONG } = require('../helpers/app_messages');

const componseToList = async (toRoles) => {

    if (!toRoles) return "admin@xyz.com"

    var mailToString = "";
    if (toRoles) {
        toRoles.forEach(role => {
            mailToString = mailToString == "" ? role.email : (mailToString + ", " + role.email);
        });

    }
    return mailToString;
}

exports.SendRequestMail = async (fromAddress, toList) => {

    const { username, nationality, mobile_no, email, address } = fromRole;

    var mailToList = await componseToList(toRoles);

    let message = "<html><head></head><body>";
    message = message + "<strong> Dated : " + new Date().toString() + "</strong>";
    message = message + "<br/><br/><br/><br/>";
    message = message + "Dear Management,";
    message = message + "<br/><br/><br/>";
    message = message + "Please do accept Test Notification:-";
    message = message + "<br/><br/><br/><br/>";
    message = message + "</strong><i>Regards</i> </strong>";
    message = message + "<br/><br/>";
    message = message + "<br/>";
    message = message + "</body></html>";

    try {
        var transporter = nodemailer.createTransport({
            //service: 'googlemail.com',
            //host: "smtp.googlemail.com",
            //port: 465,
            service: 'gmail',
            //secure: true,
            auth: {
                user: "norepy@fashtions.com",
                pass: "....."
            }
        });

        var mailOptions = {
            from: "norepy@fashtions.com",
            to: mailToList,
            subject: "Client Request for Approval",
            html: message
        };

        var mailResult = await SaveRequestNotification(fromRole, toRoles, message, notificationType, request_id);
        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.log("Email Sending Error:", error);
            } else {
                console.log("Email Sent: " + info.response);
            }
        });

        SUCCESS.result = message;
        return SUCCESS;

    } catch (error) {
        SOME_THONG_WENTWRONG.message = error.message;
        return SOME_THONG_WENTWRONG;
    }

}

