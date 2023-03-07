const mongoose = require('mongoose');

const profileScheme = new mongoose.Schema({
    name: String,
    surname: String,
    age: Number,
    education: String,
    job: String,
    phone: String,
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    }
})
const Profile = mongoose.model('Profile', profileScheme);

module.exports = {
    Profile
}