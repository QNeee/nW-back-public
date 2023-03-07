const { Friends } = require("../db/friendsModel");
const { User } = require("../db/userModel");
const { NotFound } = require("../helpers/errors");



const getAllUsers = async (owner, limit, skip, page) => {
    if (limit && page) {
        page = parseInt(page);
        const users = await User.find();
        const totalHits = users.length;
        const allUsersDataNoVerify = await User.find().select({ password: 0, token: 0 }).limit(limit).skip(skip);
        if (allUsersDataNoVerify) {
            const allUsersData = allUsersDataNoVerify.filter(item => item.verify);
            return { allUsersData, totalHits, page };
        }
    }
    const allUsersData = await User.find().select({ password: 0, token: 0 });
    return { allUsersData };
}

const getUserById = async (_id) => {
    const user = await User.findById(_id).select({ password: 0, token: 0 });
    if (!user) {
        throw new NotFound('user not found');
    }
    return user;
}
const getUserByNickname = async (nickName) => {
    const user = await User.findOne({ nickName }).select({ password: 0, token: 0 });
    if (!user) {
        throw new NotFound('user not found');
    }
    return user;
}
const findUserById = async (_id) => {
    const user = await User.findById(_id).select({ password: 0, token: 0 });
    if (!user) {
        throw new NotFound('user not found');
    }
    return user;
}
module.exports = {
    getAllUsers,
    getUserById,
    getUserByNickname,
    findUserById
}