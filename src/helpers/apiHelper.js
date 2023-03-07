const { nW } = require('./errors')

const asyncWrapper = (controller) => {
    return (req, res, next) => {
        controller(req, res).catch(next);
    }
}
const errorHandler = (error, req, res, next) => {
    if (error instanceof nW) {
        return res.status(error.status).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
}
module.exports = {
    asyncWrapper,
    errorHandler
}