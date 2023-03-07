const mongoose = require('mongoose');


const photosScheme = new mongoose.Schema({
    nickName: String,
    photoURL: String,
    name: String,
    likes: [{ name: String }],
    likesCount: {
        type: Number,
        default: 0
    },
    comments: [{ name: String, content: String, sendedDate: Date }],
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    }
})

const Photos = mongoose.model('photos', photosScheme);


module.exports = {
    Photos
}