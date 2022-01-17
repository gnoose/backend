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

var userModel = require('../models/user-model')
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

var userService = {
    getProfile: getProfile,
    updateProfile: updateProfile,
    getProfessionals: getProfessionals,
}

/**
 * Function that check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  json
 */
function getProfile(email) {
    return new Promise((resolve, reject) => {
        userModel.getProfile(email).then((data) => {
            resolve({ code: code.OK, message: '', data })
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
function updateProfile(email, newEmail, firstname, lastname) {
    return new Promise((resolve, reject) => {
        userModel.updateProfile(email, newEmail, firstname, lastname).then((data) => {
            let token = jwt.sign({ email: newEmail }, key.JWT_SECRET_KEY, {})
            resolve({ code: code.OK, message: message.PROFILE_EDIT_SUCCESS, data: {token: token} })
        }).catch((err) => {
            if (err.message === message.INTERNAL_SERVER_ERROR)
                reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
            else
                reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
        })
    })
}

function getProfessionals(searchKey, currentRegion, email) {
    return new Promise((resolve, reject) => {
        userModel.getProfessionals(searchKey, currentRegion).then((data) => {
            let token = jwt.sign({ email: email }, key.JWT_SECRET_KEY, {})
            resolve({ code: code.OK, message: message.PROFESSIONAL_GET_SUCCESS, data: {token: token, data} })
        }).catch((err) => {
            if (err.message === message.INTERNAL_SERVER_ERROR)
                reject({ code: code.INTERNAL_SERVER_ERROR, message: err.message, data: {} })
            else
                reject({ code: code.BAD_REQUEST, message: err.message, data: {} })
        })
    })
}


module.exports = userService
