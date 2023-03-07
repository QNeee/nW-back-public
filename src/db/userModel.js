const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userScheme = new mongoose.Schema({
    password: {
        type: String,
        required: [true, 'Set password for user'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    verify: {
        type: Boolean,
        default: false,
    },
    firstProfile: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String,
    },
    friends: {
        type: Number,
        default: 0
    },
    friendsId: [],
    tempFriends: [],
    nickName: {
        type: String,
        required: true,
    },
    avatarURL: String,
    token: String,
    messageCount: {
        outbox: {
            type: Number,
            default: 0,
        },
        inbox: {
            type: Number,
            default: 0,
        },
        archive: {
            type: Number,
            default: 0,
        },
    }
})
userScheme.pre('save', async function () {
    if (this.isNew) {
        this.password = await bcrypt.hash(this.password, 10);
    }
})
const User = mongoose.model('User', userScheme);

module.exports = {
    User
}