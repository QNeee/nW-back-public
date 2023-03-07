const express = require('express')
const router = express.Router();
const { registerController, logOutController, registerConfirmController, currentController, loginController, resendConfirmController } = require('../controllers/authController')
const { asyncWrapper } = require('../helpers/apiHelper');
const { authMiddleware } = require('../middlewares/authMiddleware')
const { registerValidation, resendValidation, loginValidation } = require('../middlewares/validationMiddleware');
router.post('/register', registerValidation, asyncWrapper(registerController));
router.get('/users/verify/:verificationToken', asyncWrapper(registerConfirmController));
router.post('/users/verify', resendValidation, asyncWrapper(resendConfirmController));
router.post('/login', loginValidation, asyncWrapper(loginController));
router.post('/logout', authMiddleware, asyncWrapper(logOutController));
router.post('/current', authMiddleware, currentController);

module.exports = router;