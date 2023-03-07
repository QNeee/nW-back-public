const express = require('express')
const router = express.Router();
const { getAllusersController, getUserByIdController, getUserByNickNameController, findUserByIdController } = require('../controllers/userController')
const { asyncWrapper } = require('../helpers/apiHelper');
const { authMiddleware } = require('../middlewares/authMiddleware')
router.get('/', authMiddleware, asyncWrapper(getAllusersController));
router.get('/:id', authMiddleware, asyncWrapper(getUserByIdController));
router.get('/nickName/:name', authMiddleware, asyncWrapper(getUserByNickNameController));
router.get('/find/:id', authMiddleware, asyncWrapper(findUserByIdController));

module.exports = router;