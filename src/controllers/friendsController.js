const { getFriendById, addToFriendVerify, getAllFriends, postFriend, deleteFriend } = require('../services/friendsService')

const getAllFriendsController = async (req, res) => {
    const { _id: owner } = req.user;
    if (req.query) {
        const query = Object.keys(req.query).join('');
        const friends = await getAllFriends(owner, query);
        return res.status(200).json(friends);
    }
    const friends = await getAllFriends(owner);
    return res.status(200).json(friends);
}
const getFriendByIdController = async (req, res) => {
    const { _id: owner } = req.user;
    const { friendId } = req.params;
    const friend = await getFriendById(friendId, owner);
    return res.status(200).json({ friend });

}
const postFriendController = async (req, res) => {
    const { id } = req.body;
    const { _id: owner } = req.user;
    const newFriend = {
        id,
        owner,
    }
    const adedFriend = await postFriend(newFriend, owner);
    return res.status(201).json(adedFriend);
}
const deleteFriendController = async (req, res) => {
    const { _id: owner } = req.user;
    const { friendId } = req.params;
    const deletedFriend = await deleteFriend(friendId, owner);
    return res.status(200).json(deletedFriend);
}
const addToFriendVerifyController = async (req, res) => {
    const { _id: owner } = req.user;
    const { verificationToken } = req.params;
    await addToFriendVerify(owner, verificationToken);
    return res.status(200).json({ message: 'success' });
}
module.exports = {
    getAllFriendsController,
    getFriendByIdController,
    postFriendController,
    deleteFriendController,
    addToFriendVerifyController
}