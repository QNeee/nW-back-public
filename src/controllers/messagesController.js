const { postMessage, getAllMessages, getAllOutboxMessages,
    getAllInboxMessages,
    getAllArchiveMessages,
    getInboxMessageById,
    getOutboxMessageById,
    getArchiveMessageById,
    patchMessageReadStatus,
    deleteMessageOutbox,
    deleteMessageInbox,
    getAllSortedMessages,
    deleteDialog,
    getAllDialog,
    patchDialogueReadStatus

} = require('../services/messagesService');

const postMessageController = async (req, res) => {
    const { _id: owner } = req.user;
    const message = await postMessage(req.body, owner);
    return res.status(201).json({ message })
}
const getInboxMessageByIdController = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const message = await getInboxMessageById(id, owner);
    return res.status(200).json({ message });
}
const getOutboxMessageByIdController = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const message = await getOutboxMessageById(id, owner);
    return res.status(200).json({ message });
}
const getArchiveMessageByIdController = async (req, res) => {
    const { id } = req.params;
    const { _id: owner } = req.user;
    const message = await getArchiveMessageById(id, owner);
    return res.status(200).json({ message });
}
const getAllMessagesController = async (req, res) => {
    const { _id: owner } = req.user;
    const messages = await getAllMessages(owner);
    return res.status(200).json(messages);
}
const getAllSortedMessageController = async (req, res) => {
    const { _id: owner } = req.user;
    const messages = await getAllSortedMessages(owner, req.query.sorted);
    return res.status(200).json(messages);
}
const getAllInboxMessageController = async (req, res) => {
    const { _id: owner } = req.user;
    const limitNumber = 5;
    let {
        page,
        limit = limitNumber,
        skip = 0 } = req.query;
    if (page && limit) {
        limit = parseInt(limit) > limitNumber ? limitNumber : parseInt(limit);
        skip = parseInt(page) === '1' ? skip.toString() : parseInt(page) * limit - limitNumber;
        const messages = await getAllInboxMessages(owner, { limit, skip, page });
        return res.status(200).json(messages);
    }
    const messages = await getAllInboxMessages(owner, { limit, page });
    return res.status(200).json(messages);
}
const getAllOutboxMessageController = async (req, res) => {
    const { _id: owner } = req.user;
    const messages = await getAllOutboxMessages(owner);
    return res.status(200).json(messages);
}
const getAllArchiveMessageController = async (req, res) => {
    const { _id: owner } = req.user;
    const messages = await getAllArchiveMessages(owner);
    return res.status(200).json(messages);
}
const patchMessageReadStatusController = async (req, res) => {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const message = await patchMessageReadStatus(id, owner, req.body)
    return res.status(200).json(message);
}
const deleteInboxMessageController = async (req, res) => {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const deletedMessage = await deleteMessageInbox(owner, id);
    return res.status(200).json(deletedMessage)
}
const deleteOutboxMessageController = async (req, res) => {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const deletedMessage = await deleteMessageOutbox(owner, id);
    return res.status(200).json(deletedMessage)
}

const getAllDialogsController = async (req, res) => {
    const { _id: owner } = req.user;
    const dialogs = await getAllDialog(owner);
    return res.status(200).json(dialogs);
}
const patchDialogueReadStatusController = async (req, res) => {
    const { _id: owner } = req.user;
    const { dialogue } = req.params;
    const patchedDialogue = await patchDialogueReadStatus(owner, dialogue);
    return res.status(200).json(patchedDialogue);
}
module.exports = {
    postMessageController,
    getAllMessagesController,
    getAllInboxMessageController,
    getAllOutboxMessageController,
    getAllArchiveMessageController,
    getInboxMessageByIdController,
    getOutboxMessageByIdController,
    getArchiveMessageByIdController,
    patchMessageReadStatusController,
    deleteInboxMessageController,
    deleteOutboxMessageController,
    getAllSortedMessageController,
    getAllDialogsController,
    patchDialogueReadStatusController
}