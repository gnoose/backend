/**
 * Auth model file
 *
 * @package   backend/src/models
 * @author    Taras Hryts <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/
 */

var db = require('../database/database')
var message = require('../constants/message')
var bcrypt = require('bcrypt-nodejs')
var table = require('../constants/table')
var jwt = require('jsonwebtoken')
var key = require('../config/key-config')
var randtoken = require('rand-token');
var timeHelper = require('../helper/timeHelper')
var authModel = {
    login: login,
    register: register,
    googleAuth: googleAuth,
    confirm: confirm,
    forgotPassword: forgotPassword,
    resetPassword: resetPassword,
    logout: logout,
}


/**
 * Check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function login(email, password) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT * FROM user WHERE email = ? and (user_type = "B2C" or user_type = "PRO")'

        db.query(query, [email], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length > 0) {
                    if (rows[0].status === 1) {
                        bcrypt.compare(password, rows[0].password, function (error, result) {
                            if (error) {
                                reject({ message: message.INVALID_PASSWORD })
                            } else {
                                if (result) {
                                    resolve(rows[0])
                                } else {
                                    reject({ message: message.INVALID_PASSWORD })
                                }
                            }
                        })
                    } else {
                        reject({ message: message.INVALID_CONFIRM})
                    }
                } else {
                    reject({ message: message.ACCOUNT_NOT_EXIST })
                }
            }
        })
    })
}

/**
 * Check user register status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function register(firstname, lastname, email, password) {
    return new Promise((resolve, reject) => {
        let query = 'Select * from user where email = ?'

        db.query(query, [email], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length > 0) {
                    reject({ message: message.USER_ALREADY_EXIST})
                } else {
                    let password_hash = bcrypt.hashSync(password)
                    let query = 'Insert into user (created, updated, first_name, last_name, email, password, status, reset_password_timeout, supervised, user_type, login_type, activate_timeout) values (?,?,?,?,?,?,?,?,?,?,?,?)'
            
                    db.query(query, [timeHelper.getCurrentTime(),timeHelper.getCurrentTime(),firstname, lastname, email, password_hash, 0, 0, 0, "B2C", 0, 0], (error, rows, fields) => {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR })
                        } else {
                            resolve("OK")
                        }
                    })
                }
            }
        })
        
    })
}

/**
 * Check user register status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function googleAuth(firstname, lastname, email) {
    return new Promise((resolve, reject) => {
        let query = 'Select * from user where email = ?'

        db.query(query, [email, 1], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length > 0) {
                    if (rows[0].status === 1) 
                        resolve("OK")
                    else
                        reject({message: message.INVALID_CONFIRM})
                } else {
                    let query = 'Insert into user (created, updated, first_name, last_name, email, status, reset_password_timeout, supervised, user_type, login_type, activate_timeout) values (?,?,?,?,?,?,?,?,?,?,?)'
            
                    db.query(query, [timeHelper.getCurrentTime(),timeHelper.getCurrentTime(),firstname, lastname, email, 1, 0, 0, "B2C", 1, 0], (error, rows, fields) => {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR })
                        } else {
                            resolve("OK")
                        }
                    })
                }
            }
        })
        
    })
}

/**
 * Check user register status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function facebookAuth(firstname, lastname, email) {
    return new Promise((resolve, reject) => {
        let query = 'Select * from user where email = ?'

        db.query(query, [email], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length > 0) {
                    resolve("OK")
                } else {
                    let query = 'Insert into user (created, updated, first_name, last_name, email, status, reset_password_timeout, supervised, user_type, mail_confirm, login_type, activate_timeout) values (?,?,?,?,?,?,?,?,?,?,?,?)'
            
                    db.query(query, [timeHelper.getCurrentTime(),timeHelper.getCurrentTime(),firstname, lastname, email, 1, 0, 0, "B2C", 1, 2, 0], (error, rows, fields) => {
                        if (error) {
                            reject({ message: message.INTERNAL_SERVER_ERROR })
                        } else {
                            resolve("OK")
                        }
                    })
                }
            }
        })
        
    })
}

/**
 * Check user register status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function confirm(token) {
    return new Promise(async (resolve, reject) => {
        let decoded_token = '';
        await jwt.verify(token, key.JWT_SECRET_KEY, (err, decoded) => { 
            if (err) {
                reject({message: message.INTERNAL_SERVER_ERROR});
            } else {
                decoded_token = decoded.email
            }

        })
        if (decoded_token !== '') {
            let query = 'Select * from user where email = ?'

            db.query(query, [decoded_token], (error, rows, fields) => {
                if (error) {
                    reject({ message: message.INTERNAL_SERVER_ERROR })
                } else {
                    if (rows.length == 0) {
                        reject({ message: message.NOT_CREATED_ACCOUNT})
                    } else {
                        let query = 'Update user set status = 1 where email = ?'
                
                        db.query(query, [decoded_token], (error, rows, fields) => {
                            if (error) {
                                reject({ message: message.INTERNAL_SERVER_ERROR })
                            } else {
                                resolve("Successfully Confirmed")
                            }
                        })
                    }
                }
            })
        } else {
            reject({ message: message.INTERNAL_SERVER_ERROR})
        }
    })
}

/**
 * Check user register status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function forgotPassword(email) {
    return new Promise((resolve, reject) => {
        let randomPassword = randtoken.generate(15);
        let new_pass = bcrypt.hashSync(randomPassword)
        let query = 'UPDATE user SET password = ? WHERE email = ?'

        db.query(query, [new_pass, email], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve(randomPassword)
            }
        })
    })
}

/**
 * Check user register status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function resetPassword(email, oldPwd, newPwd) {
    return new Promise((resolve, reject) => {
        let new_pass = bcrypt.hashSync(newPwd)
        let query = 'Select * from user where email = ?'

        db.query(query, [email], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length == 0) {
                    reject({ message: message.NOT_CREATED_ACCOUNT})
                } else {
                    bcrypt.compare(oldPwd, rows[0].password, function (error, result) {
                        if (error || !result) {
                            reject({ message: message.INVALID_PASSWORD })
                        } else {
                            let query = 'UPDATE user SET password = ? WHERE email = ?'

                            db.query(query, [new_pass, email], (error, rows, fields) => {
                                if (error) {
                                    reject({ message: message.INTERNAL_SERVER_ERROR })
                                } else {
                                    resolve("OK")
                                }
                            })
                        }
                    })
                }
            }
        })
    })
}

function logout() {
    return new Promise((resolve, reject) => {
        resolve()
    })
}

module.exports = authModel
