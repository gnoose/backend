/**
 * Auth router file
 *
 * @package   backend/src/routes
 * @author    Taras Hryts <streaming9663@gmail.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly/api/auth
 */

var express = require('express')
var router = express.Router()
var authService = require('../services/auth-service')
var authMiddleware = require('../middleware/auth-middleware')
const {validate} = require('express-validation')
var authValidation = require('../validator/auth-validation')
let http = require('http');
let fs = require('fs');
/**
 * Login api
 */
router.post('/login', login)

/**
 * Register api
 */
router.post('/register', register)
router.post('/googleAuth', googleAuth)
router.get('/confirm', confirm)

/**
 * ForgotPassword api
 */
router.post('/forgotpassword', forgotPassword)
router.post('/resetpassword', authMiddleware.checkToken, resetPassword)

/**
 * logout
 */
router.post('/logout', logout)

/**
 * Function that check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function login(req, res) {
    let email = req.body.email
    let password = req.body.password

    authService.login(email, password).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function register(req, res) {
    let firstname = req.body.firstname
    let lastname = req.body.lastname
    let email = req.body.email
    let password = req.body.password

    authService.register(firstname, lastname, email, password).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function confirm(req, res) {
    token = req.query.token;
    authService.confirm(token).then((result) => {
        if (result == 'Successfully Confirmed')
            res.render('confirm-page')
    }).catch((err) => {
        res.json(err)
    })
}
/**
 * Function that check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function googleAuth(req, res) {
    console.log(req.body);
    let firstname = req.body.user.givenName
    let lastname = req.body.user.familyName
    let email = req.body.user.email
    console.log(firstname, lastname, email)
    authService.googleAuth(firstname, lastname, email).then((result) => {
        console.log('googleAuthResult: ', result);
        res.json(result)
    }).catch((err) => {
        console.log('googleAuthErr: ', err);
        res.json(err)
    })
}

/**
 * Function that check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function forgotPassword(req, res) {
    let email = req.body.email

    authService.forgotPassword(email).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function resetPassword(req, res) {
    let email = req.decoded.email
    let oldPwd = req.body.oldpassword
    let newPwd = req.body.newpassword
    authService.resetPassword(email, oldPwd, newPwd).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}
/**
 * Function to logout
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function logout(req, res) {
    // let userId = req.decoded.uid
    authService.logout().then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

module.exports = router
