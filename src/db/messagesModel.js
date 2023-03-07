const mongoose = require('mongoose');


const messagesScheme = new mongoose.Schema({
    sender: String,
    receiver: String,
    view: {
        inbox: { "type": Boolean, default: false },
        outbox: { "type": Boolean, default: false },
        archive: { "type": Boolean, default: false },
    },
    content: { type: String },
    read: {
        marked: { "type": Boolean, default: false },
        date: Date
    },
    find: String,
    sendedDate: {
        type: Date,
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    }
})

const Message = mongoose.model('messages', messagesScheme);


module.exports = {
    Message
}