const express = require('express')
const router = express.Router();
const { getAllFriendsController, addToFriendVerifyController, getFriendByIdController, deleteFriendController, postFriendController } = require('../controllers/friendsController')
const { asyncWrapper } = require('../helpers/apiHelper');
const { authMiddleware } = require('../middlewares/authMiddleware')
router.get('/', authMiddleware, asyncWrapper(getAllFriendsController));
router.get('/:friendId', authMiddleware, asyncWrapper(getFriendByIdController));
router.get('/verify/:verificationToken', authMiddleware, asyncWrapper(addToFriendVerifyController));
router.post('/', authMiddleware, asyncWrapper(postFriendController));
router.delete('/:friendId', authMiddleware, asyncWrapper(deleteFriendController));
module.exports = router;