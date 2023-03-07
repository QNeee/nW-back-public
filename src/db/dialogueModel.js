const mongoose = require('mongoose');


const dialogueScheme = new mongoose.Schema({
    dialogue: [],
    email: String,
    owner: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'user',
    }
})

const Dialogue = mongoose.model('Dialogue', dialogueScheme);
module.exports = {
    Dialogue
}