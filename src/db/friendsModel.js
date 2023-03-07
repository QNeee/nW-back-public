const mongoose = require('mongoose');


const friendsScheme = new mongoose.Schema({
    nickName: String,
    avatarURL: String,
    find: String,
    email: String,
    verify: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
    },
    id: {
        type: mongoose.SchemaTypes.ObjectId
    },
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    }
})

const Friends = mongoose.model('friends', friendsScheme);


module.exports = {
    Friends
}