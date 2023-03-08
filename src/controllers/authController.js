const { register, registerConfirm, resendConfirm, login, current, logOut } = require('../services/authService')
const registerController = async (req, res) => {
    const { email, password, nickName } = req.body;
    const newUser = await register(email, password, nickName);
    return res.status(201).json({ newUser })
}
const registerConfirmController = async (req, res) => {
    const { verificationToken } = req.params;
    await registerConfirm(verificationToken);
    return res.status(200).json({ message: 'Verification successful' });

}
const resendConfirmController = async (req, res) => {
    const { email } = req.body;
    await resendConfirm(email);
    return res.status(200).json({ message: "Verification email sent" })
}

const loginController = async (req, res) => {
    const { email, password } = req.body;
    const loginData = await login(email, password);
    const token = loginData.token;
    const user = {
        email: loginData.user.email,
        nickName: loginData.user.nickName,
        id: loginData.id
    }
    return res.json({ token, user })
}
const currentController = async (req, res) => {
    const { _id: owner } = req.user;
    const response = await current(owner);
    return res.status(200).json({ response });
}
const logOutController = async (req, res) => {
    const { _id: owner } = req.user;
    await logOut(owner);
    return res.status(204).json({});
}

module.exports = {
    registerController,
    registerConfirmController,
    resendConfirmController,
    loginController,
    currentController,
    logOutController,
}