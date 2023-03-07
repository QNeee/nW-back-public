const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const friendsRoutes = require('./routes/friendsRoutes');
const messagesRoutes = require('./routes/messagesRoutes')
const userRoutes = require('./routes/userRoutes')
const profileRoutes = require('./routes/profileRoutes')
const photosRoutes = require('./routes/photosRoutes')
const { errorHandler } = require('./helpers/apiHelper');
const app = express();
const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';
app.use(logger(formatsLogger))
app.use(cors())
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/friends', friendsRoutes)
app.use('/api/messages', messagesRoutes)
app.use('/api/users', userRoutes)
app.use('/api/profiles', profileRoutes)
app.use('/api/photos', photosRoutes)
app.use(express.static('./public'));
app.use(errorHandler);

//

module.exports = app;