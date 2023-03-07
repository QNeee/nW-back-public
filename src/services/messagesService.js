
const { Dialogue } = require("../db/dialogueModel");
const { Message } = require("../db/messagesModel");
const { User } = require("../db/userModel");
const { WrongParametersError, NotFound, NotAuthorized } = require("../helpers/errors");



const postMessage = async (body, owner) => {
    const { sender, content, receiver } = body;
    const user = await User.findOne({ _id: owner });
    if (!user) {
        throw new NotAuthorized('not autorized');
    }
    const receiverMessage = await User.findOne({ nickName: receiver });
    const senderMessage = await User.findOne({ nickName: sender });
    const recieverFriendsId = receiverMessage.friendsId.map(item => item);
    if (!recieverFriendsId.includes(user.email)) {
        throw new NotFound('user not found in user Friends')
    }
    if (!sender || !content || !receiver) {
        throw new WrongParametersError('need body');
    }
    if (!receiverMessage) {
        throw new NotFound(`receiver with nickname :${receiver} not Found`)
    }
    if (user.nickName !== senderMessage.nickName) {
        throw new NotAuthorized('Not authorized')
    }
    const inboxMessage = {
        sender,
        receiver,
        content,
        view: { inbox: true, outbox: false, archive: false },
        read: { marked: false },
        sendedDate: Date.now(),
        owner: receiverMessage._id,
        find: senderMessage._id,
    }
    const outboxMessage = {
        sender,
        receiver,
        content,
        view: { inbox: false, outbox: true, archive: false },
        read: { marked: false },
        sendedDate: inboxMessage.sendedDate + 1,
        owner: senderMessage._id,
        find: receiverMessage._id,
    }
    const inbox = new Message(inboxMessage);
    const outbox = new Message(outboxMessage);
    await inbox.save();
    await outbox.save();
    await receiverMessage.save();
    await senderMessage.save();
    return outbox;
}
const getInboxMessageById = async (_id, owner) => {
    const message = await Message.findOne({ _id, owner, });
    if (!message) {
        throw new NotFound('not Found');
    }
    return message;
}
const getOutboxMessageById = async (_id, owner) => {
    const message = await Message.findOne({ _id, owner, });
    if (!message) {
        throw new NotFound('not Found');
    }
    return message;
}
const getArchiveMessageById = async (_id, owner) => {
    const message = await Message.findOne({ _id, owner, });
    if (!message) {
        throw new NotFound('not Found');
    }
    return message;
}
const getAllMessages = async (owner) => {
    const userMessages = await Message.find({ owner });
    const readMessages = userMessages.filter(item => item.read.marked === true);
    const unReadMessages = userMessages.filter(item => item.read.marked === false);
    const messages = [...unReadMessages, ...readMessages];
    return messages;
}
const getAllSortedMessages = async (owner, body) => {
    const user = await User.findById(owner);
    if (!user) {
        throw new NotAuthorized("Not Authorized");
    }
    const receiver = await User.find({ nickName: body });
    const id = receiver.map(item => item._id).join('');
    const receiverEmail = receiver.map(item => item.email).join('');
    const messagesB = await Message.find({ sender: body, owner: id, receiver: user.nickName });
    const messagesB1 = await Message.find({ sender: user.nickName, owner: id, receiver: body });
    const messageB2 = [...messagesB, ...messagesB1];
    const checkDialogUser = await Dialogue.find({ email: receiverEmail });
    const checkDialogUser1 = await Dialogue.find({ email: user.email });
    if (checkDialogUser.length === 0) {
        const newDialogueUser = new Dialogue({
            owner: id,
            email: receiverEmail,
            dialogue: messageB2
        })

        await newDialogueUser.save();
    }
    if (checkDialogUser1.length === 0) {
        const newDialogueUser1 = new Dialogue({
            owner: user._id,
            email: user.email,
            dialogue: messageB2
        })
        await newDialogueUser1.save();
    }
    await Dialogue.findOneAndUpdate({ owner: user._id, dialogue: messageB2 });
    await Dialogue.findOneAndUpdate({ owner: id, dialogue: messageB2 });
    const dialogToSend = await Dialogue.findOne({ owner: id });
    const dialogue = dialogToSend.dialogue.sort((a, b) => a.sendedDate - b.sendedDate);
    return dialogue;
}
const getAllOutboxMessages = async (owner) => {
    const outboxMessages = await Message.find({ owner });
    const userId = outboxMessages.map(item => item.receiver).join('');
    const outboxMessagesData = outboxMessages.filter(item => item.view.outbox === true)
    return outboxMessagesData;
}
const getAllInboxMessages = async (owner, { limit, skip, page }) => {
    if (limit && skip) {
        const userMessages = await Message.find({ owner, view: { inbox: true, outbox: false, archive: false } }).limit(limit).skip(skip);
        const totalHits = userMessages.length;
        const unreadMessages = userMessages.filter(item => item.read.marked === false);
        const readMessages = userMessages.filter(item => item.read.marked === true);
        const messages = [...unreadMessages, ...readMessages];
        return { messages, totalHits, page };

    }
    const userMessages = await Message.find({ owner, view: { inbox: true, outbox: false, archive: false } }).limit(limit);
    const unreadMessages = userMessages.filter(item => item.read.marked === false);
    const readMessages = userMessages.filter(item => item.read.marked === true);
    const messages = [...unreadMessages, ...readMessages];
    return { messages, page }
}
const getAllArchiveMessages = async (owner) => {
    const archiveMessages = await Message.find({ owner });
    const archiveMessagesData = archiveMessages.filter(item => item.view.archive === true)
    return archiveMessagesData;
}
const patchMessageReadStatus = async (id, owner, body) => {
    const _id = id;
    const patchedStatus = await Message.findOneAndUpdate({ _id, owner }, body)
    if (!patchedStatus) {
        throw new NotFound('Not Found')
    }
    const patchedStatusRead = await Message.findById(_id);
    return patchedStatusRead;
}
const deleteMessageInbox = async (owner, id) => {
    const _id = id;
    const user = await User.findById(owner);
    if (!user) {
        throw new NotFound('Not Found')
    }
    const deleteMessage = await Message.findOneAndRemove({ _id, owner });
    user.messageCount.inbox--;
    await user.save();
    if (!deleteMessage) {
        throw new NotFound('Not Found');
    }
    return deleteMessage;
}
const deleteMessageOutbox = async (owner, id) => {
    const _id = id;
    const user = await User.findById(owner);
    if (!user) {
        throw new NotFound('Not Found')
    }
    const deleteMessage = await Message.findOneAndRemove({ _id, owner });
    user.messageCount.outbox--;
    await user.save();
    if (!deleteMessage) {
        throw new NotFound('Not Found');
    }
    return deleteMessage;
}

const getAllDialog = async (owner) => {
    const user = await User.findById(owner);
    if (!user) {
        throw new NotAuthorized('Not Authorized');
    }
    const dialogs = await Dialogue.find();
    return dialogs;
}
const patchDialogueReadStatus = async (owner, dialogue) => {
    const user = await User.findById(owner);
    if (!user) {
        throw new NotAuthorized('Not Authorized');
    }
    const messages = await Message.find({ owner, sender: dialogue, read: { marked: false } })
    if (messages.length !== 0) {
        for (let i = 0; i < messages.length; i++) {
            await Message.findOneAndUpdate({ owner, sender: dialogue, read: { marked: false } }, { read: { marked: true } });
        }
    }
}
module.exports = {
    postMessage,
    getAllMessages,
    getAllOutboxMessages,
    getAllInboxMessages,
    getAllArchiveMessages,
    getInboxMessageById,
    getOutboxMessageById,
    getArchiveMessageById,
    patchMessageReadStatus,
    deleteMessageInbox,
    deleteMessageOutbox,
    getAllSortedMessages,
    getAllDialog,
    patchDialogueReadStatus
}