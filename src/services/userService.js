const { Friends } = require("../db/friendsModel");
const { User } = require("../db/userModel");
const { NotFound, NotAuthorized, WrongParametersError } = require("../helpers/errors");



const getAllUsers = async (owner, limit, skip, page) => {
    if (limit && page) {
        page = parseInt(page);
        const users = await User.find();
        const totalHits = users.filter(item => item.verify).length;
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
const changeOnlineStatus = async (owner, body) => {
    const user = await User.findById(owner);
    if (!user) {
        throw new NotAuthorized('Not Authorizied')
    }
    const { token, status } = body;
    if (!token && !status) {
        throw new WrongParametersError('need token or status')
    }
    const updateStatusUser = await User.findOneAndUpdate({ token }, { status: status })
    return updateStatusUser;
}
module.exports = {
    getAllUsers,
    getUserById,
    getUserByNickname,
    findUserById,
    changeOnlineStatus
}