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
const axios = require('axios')
var db = require('../database/database')
var message = require('../constants/message')
var bcrypt = require('bcrypt-nodejs')
var table = require('../constants/table')
var jwt = require('jsonwebtoken')
var key = require('../config/key-config')
var randtoken = require('rand-token');
var timeHelper = require('../helper/timeHelper')
const google_key = process.env.GOOGLE_API_KEY

var userModel = {
    getProfile: getProfile,
    updateProfile: updateProfile,
    getProfessionals: getProfessionals,
}

var rad = function(x) {
    return x * Math.PI / 180;
};
  
var getDistance = function(p1, p2) {
    var R = 6378137; // Earth’s mean radius in meter
    var dLat = rad(p2.latitude - p1.latitude);
    var dLong = rad(p2.longitude - p1.longitude);
    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(rad(p1.latitude)) * Math.cos(rad(p2.latitude)) *
      Math.sin(dLong / 2) * Math.sin(dLong / 2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c;
    return d / 1000; // returns the distance in meter
};

/**
 * Check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function getProfile(email) {
    return new Promise((resolve, reject) => {
        let query = 'SELECT email, first_name, last_name FROM user WHERE email = ?'

        db.query(query, [email], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                if (rows.length > 0) {
                    resolve(rows[0])
                } else {
                    reject({ message: message.ACCOUNT_NOT_EXIST })
                }
            }
        })
    })
}

/**
 * Check user login status with email and password
 *
 * @author  Taras Hryts <streaming9663@gmail.com>
 * @param   object authData
 * @return  object If success returns object else returns message
 */
function updateProfile(email, newEmail, firstname, lastname) {
    return new Promise((resolve, reject) => {
        let query = 'Update user set email = ?, first_name = ?, last_name = ? where email = ?'

        db.query(query, [newEmail, firstname, lastname, email], (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
                resolve("ok")
            }
        })
    })
}

function getProfessionals(search, currentRegion) {
    return new Promise((resolve, reject) => {
        let query = `Select * from user u left join address a on u.address_id = a.id where u.user_type = "PRO" and (a.address like "%${search}%" or u.first_name like "%${search}%" or u.last_name like "%${search}%")`
        
        db.query(query, [], async (error, rows, fields) => {
            if (error) {
                reject({ message: message.INTERNAL_SERVER_ERROR })
            } else {
		   const {data} = await axios.get(
			   `https://maps.googleapis.com/maps/api/place/textsearch/json?query=${search}&key=${google_key}`
		      );
                for (let i = 0; i < rows.length; i ++) {
                    rows[i].dist = getDistance(currentRegion, rows[i])
                }
                for (let i = 0; i < rows.length - 1; i ++) {
                    for (let j = i + 1 ; j < rows.length; j ++) {
                        if (rows[i].dist > rows[j].dist) {
                            let temp = rows[i];
                            rows[i] = rows[j];
                            rows[j] = temp;
                        }
                    }
                }
                resolve({myAddresses: data, professional: rows});
		
            }
        })
    })
}

module.exports = userModel
