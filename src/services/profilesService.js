const { Profile } = require("../db/profileModel");
const { User } = require("../db/userModel");
const { NotAuthorized, WrongParametersError, NotFound } = require("../helpers/errors");

const getAllProfiles = async (owner) => {
    const user = await User.findById(owner);
    if (!user) {
        throw new NotAuthorized('Not authorized')
    }
    const profiles = await Profile.find();
    return profiles;
}
const postProfile = async (owner, body) => {
    const user = await User.findById(owner);
    const { name, surname, age } = body;
    const normalAge = age.split('-')[0];
    const date = new Date().getFullYear();
    const neededAge = date - parseInt(normalAge);
    if (!user) {
        throw new NotAuthorized('not authorized');
    }
    if (!name && !surname && !age) {
        throw new WrongParametersError('missing fields name , surname ,age')
    }
    const newProfile = {
        _id: owner,
        name,
        surname,
        age: neededAge,
        education: body.education ? body.education : '',
        job: body.job ? body.job : '',
        phone: body.phone ? body.phone : ''
    }
    const profile = new Profile(newProfile);
    user.firstProfile = true;
    await user.save();
    await profile.save();
    return profile;
}
const getProfileById = async (owner, id) => {
    const user = await User.findById(owner);
    if (!user) {
        throw new NotAuthorized('Not Authorized');
    }
    const profile = await Profile.findById(id);
    return profile;
}

const patchProfile = async (owner, body) => {
    const user = await User.findById(owner);
    if (!user) {
        throw new NotAuthorized('Not Authorized')
    }
    const patchedProfile = await Profile.findByIdAndUpdate(owner, body);
    return patchedProfile;
}
module.exports = {
    getAllProfiles,
    postProfile,
    getProfileById,
    patchProfile
}