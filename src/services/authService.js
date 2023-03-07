require('dotenv').config();
const { User } = require('../db/userModel');
const sha256 = require('sha256');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sgMail = require('@sendgrid/mail');
const { RegistrationConflictError, NotFound, BadRequest, WrongParametersError } = require('../helpers/errors');
const hostEmail = 'vovasagan7@gmail.com'
const { v4: uuidv4 } = require('uuid');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const register = async (email, password, nickName) => {
    const user = new User({
        email, password, avatarURL: null, nickName, verificationToken: sha256(uuidv4())
    })
    const checkUser = await User.findOne({ email });
    const checkNickName = await User.findOne({ nickName });
    if (checkUser) {
        throw new RegistrationConflictError(`Email: ${email} in use`)
    }
    if (checkNickName) {
        throw new RegistrationConflictError(`nickName: ${nickName} in use`)
    }
    const newUser = await user.save();
    if (newUser) {
        const user = await User.findOne({ email }).select({ email: 1, verificationToken: 1 });
        const hostVerify = 'http://localhost:10000/api/auth/users/verify/';
        const linkVerify = hostVerify + user.verificationToken;
        const msg = {
            to: email, // Change to your recipient
            from: hostEmail, // Change to your verified sender
            subject: 'ty for rega',
            text: `Confirm your registration to use this link = ${linkVerify}`,
            html: `U need <a href=${linkVerify}>Confirm</a> registration`,
        }
        // await sgMail.send(msg);
        return user;
    }
}
const registerConfirm = async (token) => {
    const user = await User.findOne({ verificationToken: token })
    if (!user) {
        throw new NotFound('Not Found');
    }
    await User.findByIdAndUpdate(user._id, { verificationToken: null, verify: true })
}


const resendConfirm = async (email) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new NotFound('Not Found');
    }
    if (user.verify === true) {
        throw new BadRequest("Verification has already been passed");
    }
    await User.findByIdAndUpdate(user._id, { verificationToken: null, verify: true })

}

const login = async (email, password) => {
    if (email && password) {
        const user = await User.findOne({ email, verify: true });
        if (!user) {
            throw new NotFound(`no user with email: ${email} found `);
        }
        if (!await bcrypt.compare(password, user.password)) {
            throw new WrongParametersError("Email or password is wrong");
        }
        const token = jwt.sign({
            _id: user._id,
            createdAt: user.createdAt,
        }, process.env.JWT_SECRET)
        await User.findOneAndUpdate({ email }, { token: token });
        return { token, user, id: user._id };
    }
}
const logOut = async (owner) => {
    const user = await User.findById(owner);
    if (!user) {
        throw new NotAuthorized("Not authorized");
    }
    await User.findByIdAndUpdate(owner, { token: "" });
}
const current = async (owner) => {
    const user = await User.findById(owner);
    const currentResponse = {
        email: user.email,
        nickName: user.nickName,
        token: user.token,
        id: user._id
    }
    if (!user) {
        throw new NotAuthorized("Not authorized");
    }
    return currentResponse;
}
module.exports = {
    register, logOut, registerConfirm, resendConfirm, login, current
}