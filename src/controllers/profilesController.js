const {
    getAllProfiles,
    postProfile,
    getProfileById,
    patchProfile
} = require('../services/profilesService');
const getAllProfilesController = async (req, res) => {
    const { _id: owner } = req.user;
    const profiles = await getAllProfiles(owner);
    return res.status(200).json(profiles);
}
const getProfileByIdController = async (req, res) => {
    const { _id: owner } = req.user;
    const { id } = req.params;
    const profile = await getProfileById(owner, id);
    return res.status(200).json([profile])
}
const postProfileController = async (req, res) => {
    const { _id: owner } = req.user;
    const newProfile = await postProfile(owner, req.body);
    return res.status(201).json({ newProfile })
}
const patchProfileController = async (req, res) => {
    const { _id: owner } = req.user;
    const patchedProfile = await patchProfile(owner, req.body);
    return res.status(201).json({ patchedProfile })
}

module.exports = {
    getAllProfilesController,
    getProfileByIdController,
    postProfileController,
    patchProfileController
}