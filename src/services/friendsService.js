const { Friends } = require('../db/friendsModel');
const { User } = require('../db/userModel');
const { WrongParametersError, NotFound, NotAuthorized, BadRequest } = require('../helpers/errors');
const sha256 = require('sha256');
const { v4: uuidv4 } = require('uuid');
const getAllFriends = async (owner, query) => {
    const user = await User.find({ owner });
    if (!user) {
        throw new NotAuthorized('Not Authorized');
    }
    if (query) {
        const friends = await Friends.find({ owner: query });
        return friends;
    }
    const friends = await Friends.find({ owner });
    return friends;
}

const getFriendById = async (_id, owner) => {
    const findFriendByid = await Friends.findOne({ _id, owner }).select({ __v: 0 });
    if (!findFriendByid) {
        throw new NotFound('Not Found');
    }
    return findFriendByid;
}

const postFriend = async (body, owner) => {
    const user = await User.findById(owner);
    if (!user) {
        throw new NotFound('not found');
    }
    const { id } = body;
    if (!id) {
        throw new WrongParametersError('missing field id');
    }
    const newFriend = await User.findById(id);
    const checkUserFriend = user.tempFriends.findIndex(item => item === newFriend.email);
    const checkFriendUser = newFriend.tempFriends.findIndex(item => item === user.email);
    if (checkUserFriend !== -1 && checkFriendUser !== -1) {
        throw new BadRequest('user on pending');
    }
    const friendNickName = newFriend.nickName;
    const bodyFriend = {
        nickName: friendNickName,
        avatarURL: newFriend.avatarURL,
        find: newFriend._id,
        id: newFriend._id,
        email: newFriend.email,
        owner
    }
    const bodyFriendOwner = {
        nickName: user.nickName,
        avatarURL: user.avatarURL,
        find: owner,
        id: owner,
        email: user.email,
        verificationToken: sha256(uuidv4()),
        owner: newFriend._id
    }
    const friend = new Friends(bodyFriend);
    const friendOwner = new Friends(bodyFriendOwner);
    user.tempFriends.push(newFriend.email);
    newFriend.tempFriends.push(user.email);
    await User.findOneAndUpdate({ _id: owner }, { tempFriends: user.tempFriends });
    await User.findOneAndUpdate({ _id: id }, { tempFriends: newFriend.tempFriends });
    await friend.save();
    await friendOwner.save();
    return friendOwner;

}
const deleteFriend = async (_id, owner) => {
    const user = await User.findById(owner);
    if (!user) {
        throw new NotAuthorized('Not Authorized');
    }
    const user1 = await User.findById(_id);
    if (user.tempFriends.includes(user1.email)) {
        const newTempFriensUser = user.tempFriends.filter(item => item !== user1.email);
        const newTempFriensUser1 = user1.tempFriends.filter(item => item !== user.email);

        await User.findOneAndUpdate({ _id: owner }, { tempFriends: newTempFriensUser });
        await User.findOneAndUpdate({ _id: _id }, { tempFriends: newTempFriensUser1 });
        const deleteFriends = await Friends.findOneAndRemove({ email: user1.email, owner: user._id });
        const deleteFriends1 = await Friends.findOneAndRemove({ email: user.email, owner: user1._id });
        return { deleteFriends, deleteFriends1 };
    }
    if (user.friendsId.includes(user1.email)) {
        const newFriendsIdUser = user.friendsId.filter(item => item !== user1.email);
        const newFriendsIdUser1 = user1.friendsId.filter(item => item !== user.email);
        await User.findOneAndUpdate({ _id: owner }, { friendsId: newFriendsIdUser, friends: user.friends - 1 });
        await User.findOneAndUpdate({ _id: _id }, { friendsId: newFriendsIdUser1, friends: user1.friends - 1 });
        await Friends.findOneAndRemove({ email: user1.email, owner: user._id });
        await Friends.findOneAndRemove({ email: user.email, owner: user1._id });
    } else {
        throw new BadRequest('Bad Request')
    }
}
const addToFriendVerify = async (owner, token) => {
    const user = await User.findById(owner);
    if (!user) {
        throw new NotAuthorized('Not Authorized');
    }
    const friendToVerify = await Friends.findOne({ verificationToken: token });
    const friendHaver = await Friends.findOne({ find: owner });
    if (!friendToVerify) {
        throw new NotFound('Not Found');
    }
    const user1 = await User.findById(friendToVerify.find);
    if (user.tempFriends.length > 0 && user1.tempFriends.length > 0) {
        const newTempFriensUser = user.tempFriends.filter(item => item !== user1.email);
        const newTempFriensUser1 = user1.tempFriends.filter(item => item !== user.email);
        user.friendsId.push(user1.email);
        user1.friendsId.push(user.email);
        await Friends.findOneAndUpdate({ verificationToken: token }
            , { verificationToken: null, verify: true });
        await Friends.findOneAndUpdate({ email: user.email, owner: user1._id }, { verify: true });
        await User.findOneAndUpdate({ email: user.email }, { tempFriends: newTempFriensUser, friendsId: user.friendsId, friends: user.friends + 1 });
        await User.findOneAndUpdate({ email: user1.email }, { tempFriends: newTempFriensUser1, friendsId: user1.friendsId, friends: user1.friends + 1 });
        return friendHaver;
    }
    throw new BadRequest("Bad Request")
}
module.exports = {
    getFriendById,
    getAllFriends,
    postFriend,
    deleteFriend,
    addToFriendVerify
}