const { Friends } = require("../db/friendsModel");
const { Photos } = require("../db/photosModel");
const { User } = require("../db/userModel");
const { NotAuthorized, WrongParametersError, NotFound } = require("../helpers/errors");
const postPhoto = async (owner, file) => {
    const user = await User.findById(owner);
    if (!user) {
        throw new NotAuthorized('Not Authorized')
    }
    if (!file) {
        throw new WrongParametersError('Need File');
    }
}
const postComment = async (body, owner) => {
    const user = await User.findById(owner);
    if (!user) {
        throw new NotAuthorized('Not Authorized');
    }
    const { name, content, id } = body;
    if (!name && !content && !id) {
        throw new WrongParametersError('need name content and id');
    }
    const photo = await Photos.findOne({ name: body.id });
    if (!photo) {
        throw new NotFound('Not Found');
    }
    const newComment = { name, content: content, sendedDate: body.sendedDate };
    photo.comments = [...photo.comments, newComment];
    await photo.save();
    return photo;

}
const getAllUserPhoto = async (owner, query) => {
    const user = User.findById(owner);
    if (!user) {
        throw new NotAuthorized('Not Authorized');
    }
    if (query) {
        const photos = await Photos.find({ owner: query });
        return photos;
    }
    const photos = await Photos.find({ owner });
    return photos;
}

const getUserPhotoById = async (owner, name) => {
    const user = await User.findById(owner);
    if (!user) {
        throw new NotAuthorized('Not Authorized');
    }
    if (!name) {
        throw new WrongParametersError('need url');
    }
    const photo = await Photos.findOne({ name });
    if (!photo) {
        throw new NotFound('Not Found');
    }
    return photo;
}
const postLike = async (body, owner) => {
    const user = await User.findById(owner);
    if (!user) {
        throw new NotAuthorized('NotAuthorized')
    }
    const { nickName, id } = body;
    if (!nickName && !id) {
        throw new WrongParametersError('need nickName and id');
    }
    const photo = await Photos.findOne({ name: id });
    if (!photo) {
        throw new NotFound('Not Found');
    }
    const checkLikes = photo.likes.findIndex(item => item.name === nickName);
    if (checkLikes === -1) {
        const newLike = {
            name: nickName
        }
        photo.likes = [...photo.likes, newLike];
        photo.likesCount++;
        await photo.save();
        return photo;
    } else {
        throw new NotFound('NotFound');
    }

}
const unLike = async (body, owner) => {
    const user = await User.findById(owner);
    if (!user) {
        throw new NotAuthorized('NotAuthorized')
    }
    const { nickName, id } = body;
    if (!nickName && !id) {
        throw new WrongParametersError('need nickName and id');
    }
    const photo = await Photos.findOne({ name: id });
    if (!photo) {
        throw new NotFound('Not Found');
    }
    const checkLikes = photo.likes.findIndex(item => item.name === nickName);
    if (checkLikes !== -1) {

        photo.likes.splice(checkLikes, 1);
        photo.likesCount--;
        await photo.save();
        return photo;
    } else {
        throw new NotFound('NotFound');
    }
}
const patchAvatar = async (owner, id) => {
    const user = await User.findById(owner);
    if (!user) {
        throw new NotAuthorized('Not Authorized')
    }
    if (!id) {
        throw new WrongParametersError('Need id');
    }

    const userFriends = await Friends.find({ nickName: user.nickName });
    if (userFriends.length > 0) {
        for (let i = 0; i <= userFriends.length; i++) {
            await Friends.findOneAndUpdate({ nickName: user.nickName, avatarURL: user.avatarURL }, { avatarURL: process.env.HOST + id })
        }
    }
    const patchedUserAvatar = await User.findOneAndUpdate({ _id: owner }, { avatarURL: process.env.HOST + id }).select({ password: 0, token: 0 })
    return patchedUserAvatar;
}
const deletePhoto = async (owner, id) => {
    const user = await User.findById(owner);
    if (!user) {
        throw new NotAuthorized('Not Authorized')
    }
    const avatarUrl = user.avatarURL;
    if (avatarUrl?.split('/')[4] === id) {
        await User.findByIdAndUpdate(owner, { avatarURL: null });
    }
    const userFriends = await Friends.find({ nickName: user.nickName });
    if (userFriends.length > 0) {
        for (let i = 0; i < userFriends.length; i++) {
            await Friends.findOneAndUpdate({ nickName: user.nickName }, { avatarURL: null })
        }
    }
    const photo = await Photos.findOneAndRemove({ name: id })
    return photo;
}
module.exports = {
    postPhoto,
    getAllUserPhoto,
    getUserPhotoById,
    patchAvatar,
    deletePhoto,
    postComment,
    postLike,
    unLike
}