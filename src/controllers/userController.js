const { getAllUsers,
    getUserById, getUserByNickname, changeOnlineStatus, findUserById } = require('../services/userService')


const getAllusersController = async (req, res) => {
    const limitNumber = 5;
    let {
        page,
        limit = limitNumber,
        skip = 0 } = req.query;
    const { _id: owner } = req.user;
    if (limit && page) {
        limit = parseInt(limit) > limitNumber ? limitNumber : parseInt(limit);
        skip = parseInt(page) === '1' ? skip.toString() : parseInt(page) * limit - limitNumber;
        const allUsers = await getAllUsers(owner, limit, skip, page);
        return res.status(200).json(allUsers)
    }
    const allUsers = await getAllUsers();
    return res.status(200).json(allUsers)
}
const getUserByIdController = async (req, res) => {
    const { id } = req.params;
    const user = await getUserById(id);
    return res.status(200).json(user);
}
const getUserByNickNameController = async (req, res) => {
    const { name } = req.params;
    const user = await getUserByNickname(name);
    return res.status(200).json(user);
}
const findUserByIdController = async (req, res) => {
    const { id } = req.params;
    const user = await findUserById(id);
    return res.status(200).json(user);
}
const changeOnlineStatusController = async (req, res) => {
    const { _id: owner } = req.user;
    const status = await changeOnlineStatus(owner, req.body);
    return res.status(201).json(status);
}
module.exports = {
    getAllusersController,
    getUserByIdController,
    getUserByNickNameController,
    findUserByIdController,
    changeOnlineStatusController

}