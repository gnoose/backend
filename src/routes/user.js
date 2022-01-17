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
var userService = require('../services/user-service')
var authMiddleware = require('../middleware/auth-middleware')
/**
 * Profile api
 */
router.get('/profile', authMiddleware.checkToken, getProfile)
router.post('/profile', authMiddleware.checkToken, updateProfile)
router.post('/professionals', authMiddleware.checkToken, getProfessionals)

/**
 * Function that get Profile
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getProfile(req, res) {
    let email = req.decoded.email

    userService.getProfile(email).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that get Profile
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function updateProfile(req, res) {
    let email = req.decoded.email
    let newEmail = req.body.email
    let firstname = req.body.firstname
    let lastname = req.body.lastname
    userService.updateProfile(email, newEmail, firstname, lastname).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}

/**
 * Function that get Profile
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object req
 * @param   object res
 * @return  json
 */
function getProfessionals(req, res) {
    let email = req.decoded.email
    let searchKey = req.body.searchKey
    let currentRegion = req.body.myRegion
    userService.getProfessionals(searchKey, currentRegion, email).then((result) => {
        res.json(result)
    }).catch((err) => {
        res.json(err)
    })
}


module.exports = router
