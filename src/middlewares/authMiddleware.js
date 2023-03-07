const jwt = require('jsonwebtoken');
const { NotAuthorized } = require('../helpers/errors')

const authMiddleware = async (req, res, next) => {
    try {
        const [, token] = req.headers.authorization.split(' ');
        if (!token) {
            next(new NotAuthorized('Please ,provide a token'));
        }

        const user = jwt.decode(token, process.env.JWT_SECRET);
        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        next(new NotAuthorized('Invalid Token'));
    }
}

module.exports = {
    authMiddleware
}