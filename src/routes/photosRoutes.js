const express = require('express')
const router = express.Router();
const multer = require('multer');
const path = require('path');
require('dotenv').config();
const { v4: uuidv4 } = require('uuid');
const { asyncWrapper } = require('../helpers/apiHelper');
const { authMiddleware } = require('../middlewares/authMiddleware');
const { postPhotoController,
    getAllUserPhotosController,
    getUserPhotoByIdController,
    patchAvatarController,
    deleteUserPhotoController,
    postCommentController,
    postLikeController,
    postUnLikeController } = require('../controllers/photosController');
const { User } = require('../db/userModel');
const { Photos } = require('../db/photosModel');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.resolve('./public/avatars'));
    },
    filename: async (req, file, cb) => {
        const { _id: owner } = req.user;
        const user = await User.findById(owner);
        const [, extension] = file.originalname.split('.');
        const URL = `${user.email}+${uuidv4()}.${extension}`;
        const photoURL = `${process.env.HOST}${URL}`;
        const photo = {
            nickName: user.nickName,
            photoURL,
            owner,
            name: URL
        }
        const newPhoto = new Photos(photo);
        await newPhoto.save();
        cb(null, URL);
    }
});
const avatarMiddleware = multer({ storage });
router.post('/', authMiddleware, avatarMiddleware.single('avatar'), asyncWrapper(postPhotoController));
router.get('/', authMiddleware, asyncWrapper(getAllUserPhotosController));
router.post('/comment', authMiddleware, asyncWrapper(postCommentController));
router.post('/like', authMiddleware, asyncWrapper(postLikeController));
router.post('/unLike', authMiddleware, asyncWrapper(postUnLikeController));
router.get('/:name', authMiddleware, asyncWrapper(getUserPhotoByIdController));
router.patch('/:id', authMiddleware, asyncWrapper(patchAvatarController));
router.delete('/:id', authMiddleware, asyncWrapper(deleteUserPhotoController));

module.exports = router;