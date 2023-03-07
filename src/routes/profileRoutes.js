const express = require('express')
const router = express.Router();
const { getAllProfilesController,
    getProfileByIdController,
    postProfileController,
    patchProfileController } = require('../controllers/profilesController')
const { asyncWrapper } = require('../helpers/apiHelper');
const { authMiddleware } = require('../middlewares/authMiddleware')
router.get('/', authMiddleware, asyncWrapper(getAllProfilesController));
router.get('/:id', authMiddleware, asyncWrapper(getProfileByIdController));
router.post('/', authMiddleware, asyncWrapper(postProfileController));
router.patch('/:id', authMiddleware, asyncWrapper(patchProfileController));

module.exports = router;