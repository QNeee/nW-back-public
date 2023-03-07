
const { postPhoto,
    getAllUserPhoto,
    getUserPhotoById,
    patchAvatar,
    deletePhoto,
    postComment,
    postLike,
    unLike } = require('../services/photosService')
const postPhotoController = async (req, res) => {
    const { _id: owner } = req.user;
    const photo = await postPhoto(owner, req.body)
    return res.status(200).json(photo);
}
const postCommentController = async (req, res) => {
    const { _id: owner } = req.user;
    const comment = await postComment(req.body, owner);
    return res.status(200).json(comment);
}
const postLikeController = async (req, res) => {
    const { _id: owner } = req.user;
    const comment = await postLike(req.body, owner);
    return res.status(200).json(comment);
}
const postUnLikeController = async (req, res) => {
    const { _id: owner } = req.user;
    const comment = await unLike(req.body, owner);
    return res.status(200).json(comment);
}
const getAllUserPhotosController = async (req, res) => {
    const { _id: owner } = req.user;
    if (req.query) {
        const query = Object.keys(req.query).join('');
        const photos = await getAllUserPhoto(owner, query);
        return res.status(200).json(photos);
    }
    const photos = await getAllUserPhoto(owner);
    return res.status(200).json(photos)
}
const getUserPhotoByIdController = async (req, res) => {
    const { _id: owner } = req.user;
    const { name } = req.params;
    const photo = await getUserPhotoById(owner, name)
    return res.status(200).json(photo)
}
const patchAvatarController = async (req, res) => {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const patchedAvatar = await patchAvatar(owner, id)
    return res.status(200).json(patchedAvatar);
}
const deleteUserPhotoController = async (req, res) => {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const deletedPhoto = await deletePhoto(owner, id);
    return res.status(200).json(deletedPhoto);
}

module.exports = {
    postPhotoController,
    getAllUserPhotosController,
    getUserPhotoByIdController,
    patchAvatarController,
    deleteUserPhotoController,
    postCommentController,
    postLikeController,
    postUnLikeController
}