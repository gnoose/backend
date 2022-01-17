const { Joi } = require('express-validation')

module.exports = {
    login:{
        body: Joi.object({
            email: Joi.string().required(),
            password: Joi.string().required()
        })
    },
    register:{
        body: Joi.object({
            firstname: Joi.string().required(),
            lastname: Joi.string().required(),
            email: Joi.string().required(),
            password: Joi.string().required()
        })
    },
    googleAuth:{
        body: Joi.object({
        })
    },
    verifySMS:{
        body: Joi.object({
            email: Joi.string().required(),
            code: Joi.string().required()
        })
    },
    forgotPassword:{
        body: Joi.object({
            email: Joi.string().required()
        })
    },
    verifyToken:{
        body: Joi.object({
            token: Joi.string().required()
        })
    },
    resetPassword:{
        body: Joi.object({
            token: Joi.string().required(),
            password: Joi.string().required()
        })
    }
}