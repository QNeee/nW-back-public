const express = require('express')
const router = express.Router();
const { asyncWrapper } = require('../helpers/apiHelper');
const { authMiddleware } = require('../middlewares/authMiddleware')
const { postMessageController, patchMessageReadStatusController, getAllMessagesController,
    getAllArchiveMessageController, getAllInboxMessageController,
    getAllOutboxMessageController, getArchiveMessageByIdController,
    getInboxMessageByIdController, getOutboxMessageByIdController,
    deleteInboxMessageController, getAllSortedMessageController, deleteOutboxMessageController,
    getAllDialogsController, patchDialogueReadStatusController } = require('../controllers/messagesController')


router.get('/', authMiddleware, asyncWrapper(getAllMessagesController));
router.get('/sorted', authMiddleware, asyncWrapper(getAllSortedMessageController));
router.post('/send', authMiddleware, asyncWrapper(postMessageController));
router.get('/inbox', authMiddleware, asyncWrapper(getAllInboxMessageController));
router.get('/outbox', authMiddleware, asyncWrapper(getAllOutboxMessageController));
router.get('/archive', authMiddleware, asyncWrapper(getAllArchiveMessageController));
router.get('/inbox/:id', authMiddleware, asyncWrapper(getInboxMessageByIdController));
router.get('/outbox/:id', authMiddleware, asyncWrapper(getOutboxMessageByIdController));
router.get('/archive/:id', authMiddleware, asyncWrapper(getArchiveMessageByIdController));
router.patch('/inbox/:id', authMiddleware, asyncWrapper(patchMessageReadStatusController));
router.delete('/inbox/:id', authMiddleware, asyncWrapper(deleteInboxMessageController))
router.delete('/outbox/:id', authMiddleware, asyncWrapper(deleteOutboxMessageController))
router.get('/dialog', authMiddleware, asyncWrapper(getAllDialogsController))
router.patch('/dialog/:dialogue', authMiddleware, asyncWrapper(patchDialogueReadStatusController))




module.exports = router;