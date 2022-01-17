/**
 * Index router file
 *
 * @package   backend/src/routes
 * @author    Taras Hryts <streaming9663@gmail.com>
 * @author    WangTuring <wangwang@turing.com>
 * @copyright 2020 Say Digital Company
 * @license   Turing License
 * @version   2.0
 * @link      https://turing.ly
 */

const express = require('express')
const router = express.Router()

const apiAuthRouter = require('./auth')
const apiUserRouter = require('./user')

/**
 * Authentication page API router
 */
router.use('/auth', apiAuthRouter)

router.use('/user', apiUserRouter)

module.exports = router
