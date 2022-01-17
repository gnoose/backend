/**
 * MAIL helper file
 *
 * @package   backend/src/helper
 * @author    Taras <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

const dotenv = require('dotenv')
dotenv.config()
const Mailer = require('nodemailer');
const emailType = require('../constants/mail')

function sendMail(title, email, type, token, randomToken) {
    return new Promise( async (resolve, reject) => {
        var emailContent = require(`../emailTemplate/${type}`)
        console.log(process.env.EMAIL_USER, process.env.EMAIL_PWD, process.env.EMAIL_HOST);
        var transporter = Mailer.createTransport({
            host: process.env.EMAIL_HOST,
            secure: false,
            port: 587,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PWD
            }
        });
        let data = {}
        if(type == emailType.TYPE_FORGOT_PASSWORD){
            data = {
                from: "Be Yourself <" + process.env.EMAIL_USER + ">",
                to: email,
                subject: title,
                html: `${emailContent.body}` + `${token}` + `${emailContent.body1}`
            }
        } else if (type == emailType.TYPE_SUBACCOUNT_INVITE){
            data = {
                from: "Syndicappli Support Team <" + process.env.EMAIL_USER + ">",
                to: email,
                subject: title,
                html: `${emailContent.body}` + `${emailContent.url}` + `${emailContent.body1}` + `${token}` + `${emailContent.body2}`
            }
        } else if (type == emailType.TYPE_ADMIN_CREATE) {
            data = {
                from: "Syndicappli Support Team <" + process.env.EMAIL_USER + ">",
                to: email,
                subject: title,
                html: `${emailContent.body}` + `${emailContent.url}` + `${emailContent.body1}` + `${token}` + `${emailContent.body2}`
            }
        } else if (type == emailType.TYPE_MANAGER_CREATE) {
            data = {
                from: "Syndicappli Support Team <" + process.env.EMAIL_USER + ">",
                to: email,
                subject: title,
                html: `${emailContent.body}`  + `${emailContent.url}` + `${emailContent.body1}` + `${token}` + `${emailContent.body2}`
            }
        } else if (type == emailType.TYPE_OWNER_CREATE) {
            data = {
                from: "Syndicappli Support Team <" + process.env.EMAIL_USER + ">",
                to: email,
                subject: title,
                html: `${emailContent.body}` + `${emailContent.url}` + `${emailContent.body1}` + `${token}` + `${emailContent.body2}`
            }
        } else if (type == emailType.TYPE_ACCOUNT_CREATE) {
            data = {
                from: "Be Yourself <" + process.env.EMAIL_USER + ">",
                to: email,
                subject: title,
                html: `${emailContent.body}` + `${emailContent.url + token}` + `${emailContent.body1}`
            }
        }
        
        await transporter.sendMail(data, function (err, info) {
            if(err){
                console.log(err);
                reject({message: err})
            }else{
                console.log(info);
                resolve(info)
            }
        })
    })
}

module.exports = {
    sendMail:sendMail
}
