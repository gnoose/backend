/**
 * Auth service file
 *
 * @package   backend/src/services
 * @author    Taras Hryts <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/auth/
 */

var authModel = require('../models/auth-model')
var jwt = require('jsonwebtoken')
var message = require('../constants/message')
var code = require('../constants/code')
var key = require('../config/key-config')
var timer  = require('../constants/timer')
const {sendSMS} = require('../helper/twilioHelper')
const {sendMail} = require('../helper/mailHelper')
var mail = require('../constants/mail')
var randtoken = require('rand-token');
var authHelper = require('../helper/authHelper')

var authService = {
    login: login,
    register: register,
    googleAuth: googleAuth,
    facebookAuth: facebookAuth,
    confirm: confirm,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    logout: logout
}

/**
 * Function that check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function login(email, password) {
    return new Promise((resolve, reject) => {
        authModel.login(email, password).then((data) => {
            let token = jwt.sign({ email: email }, key.JWT_SECRET_KEY, {
            })
            resolve({ code: code.OK, message: '', data: { 'token': token} })
        }).catch((err) => {
            if (err.message === message.INTERNAL_SERVER_ERROR)
                reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
            else
                reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
        })
    })
}

/**
 * Function that check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function register(firstname, lastname, email, password) {
    return new Promise((resolve, reject) => {
        authModel.register(firstname, lastname, email, password).then((data) => {
            let token = jwt.sign({ email: email }, key.JWT_SECRET_KEY, {
            })
            sendMail(mail.TITLE_ACCOUNT_CREATE, email, mail.TYPE_ACCOUNT_CREATE, token)
                .then((response) => {
                    resolve({ code: code.OK,  message: message.CREATE_ACCOUNT_SUCCESS })
                })
                .catch((err) => {
                    if(err.message.statusCode == code.BAD_REQUEST){
                        reject({ code: code.INTERNAL_SERVER_ERROR, message: message.EMIL_IS_NOT_EXIST, data: {} })
                    } else {
                        reject({ code: code.INTERNAL_SERVER_ERROR, message: message.EMIL_IS_NOT_EXIST, data: {} })
                    }
                })
        }).catch((err) => {
            if (err.message === message.INTERNAL_SERVER_ERROR)
                reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
            else
                reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
        })
    })
}

/**
 * Function that check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function googleAuth(firstname, lastname, email) {
    return new Promise((resolve, reject) => {
        authModel.googleAuth(firstname, lastname, email).then((data) => {
            let token = jwt.sign({ email: email }, key.JWT_SECRET_KEY, {
            })
            resolve({ code: code.OK, message: message.CREATE_ACCOUNT_SUCCESS, data: { 'token': token} })
        }).catch((err) => {
            if (err.message === message.INTERNAL_SERVER_ERROR)
                reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
            else
                reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
        })
    })
}

/**
 * Function that check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function facebookAuth(firstname, lastname, email) {
    return new Promise((resolve, reject) => {
        authModel.facebookAuth(firstname, lastname, email).then((data) => {
            resolve({ code: code.OK, message: message.CREATE_ACCOUNT_SUCCESS })
        }).catch((err) => {
            if (err.message === message.INTERNAL_SERVER_ERROR)
                reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
            else
                reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
        })
    })
}

/**
 * Function that check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function confirm(token) {
    return new Promise((resolve, reject) => {
        authModel.confirm(token).then((data) => {
            resolve("Successfully Confirmed");
        }).catch((err) => {
            if (err.message === message.INTERNAL_SERVER_ERROR)
                resolve("Can't Confirmed");
            else
                resolve("Can't Confirmed");
        })
    })
}

/**
 * Function that check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function forgotPassword(email) {
    return new Promise((resolve, reject) => {
        authModel.forgotPassword(email).then((randomPassword) => {
            sendMail(mail.TITLE_FORGOT_PASSWORD, email, mail.TYPE_FORGOT_PASSWORD, randomPassword)
                .then((response) => {
                    resolve({ code: code.OK, message: message.EMAIL_RESET_LINK_SENT_SUCCESSFULLY, data: {}})
                })
                .catch((err) => {
                    if(err.message.statusCode == code.BAD_REQUEST){
                        reject({ code: code.INTERNAL_SERVER_ERROR, message: message.EMIL_IS_NOT_EXIST, data: {} })
                    } else {
                        reject({ code: code.INTERNAL_SERVER_ERROR, message: message.EMIL_IS_NOT_EXIST, data: {} })
                    }
                })
        }).catch((err) => {
            if (err.message === message.INTERNAL_SERVER_ERROR)
                reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
            else
                reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
        })
    })
}

/**
 * Function that check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function resetPassword(email, oldPwd, newPwd) {
    return new Promise((resolve, reject) => {
        authModel.resetPassword(email, oldPwd, newPwd).then((result) => {
            resolve({ code: code.OK, message: message.PASSWORD_RESET_SUCCESS, data: {}})
        }).catch((err) => {
            if (err.message === message.INTERNAL_SERVER_ERROR)
                reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
            else
                reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
        })
    })
}

/**
 * Function to logout
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @return  string
 */
function logout() {
    return new Promise((resolve, reject) => {
        authModel.logout().then((result) => {
            resolve({ code: code.OK, message: '', data: {} })
        }).catch((err) => {
            if (err.message === message.INTERNAL_SERVER_ERROR)
                reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
            else
                reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
        })
    })
}

module.exports = authService
