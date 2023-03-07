const Joi = require('joi');
const registerValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string().required(),
        nickName: Joi.string().required()
    })
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).json({ status: validationResult.error.details })
    }
    next();
}
const loginValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
        password: Joi.string().required(),
    })
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).json({ status: validationResult.error.details })
    }
    next();
}
const resendValidation = (req, res, next) => {
    const schema = Joi.object({
        email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }).required(),
    });
    const validationResult = schema.validate(req.body);
    if (validationResult.error) {
        return res.status(400).json({ status: validationResult.error.details })
    }
    next();
}
module.exports = {
    registerValidation,
    resendValidation,
    loginValidation

}