const mongoose = require('mongoose');
mongoose.set('strictQuery', false);
const connectMongo = async () => {
    return mongoose.connect(process.env.Mongo_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
}
module.exports = {
    connectMongo
}