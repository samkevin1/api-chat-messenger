import express from 'express';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import cors from 'cors';
import passport from 'passport';
import cookieSession from 'cookie-session';
import dotenv from 'dotenv';
dotenv.config();

import './Services/passport.js';
import isLoggedIn from './Middleware/auth.js';
import messageRoutes from './routes/message.js';
import userRoutes from './routes/user.js';
import roomRoutes from './routes/room.js';
import pusher from './Services/pusher.js';
import db from './Services/pusherDb.js';

const app = express();

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, PATCH, DELETE, OPTIONS');
    next();
});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use('/message', messageRoutes);
app.use('/user', userRoutes);
app.use('/room', roomRoutes);

app.use(cookieSession({
  name: 'google-auth-session',
  keys: ['key1', 'key2']
}))
app.use(passport.initialize());
app.use(passport.session());

const CONNECTION_URL = 'mongodb+srv://admin:221bakerstreet@cluster0.lvtxl.mongodb.net/chatdb?retryWrites=true&w=majority';
const PORT = process.env.PORT || 9000;;

mongoose.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true})
  .then(() => app.listen(PORT, () => console.log(`Server running on port: ${PORT}`)))
  .catch((err) => console.log(err.message));
  
mongoose.set('useFindAndModify', false);

app.get('/auth', passport.authenticate('google', { scope: ['profile', 'email'] }));
app.get('/auth/error', (req, res) => res.send('Unknown Error'))
app.get('/api/account/google', passport.authenticate('google', { failureRedirect: '/auth/error' }),
  function(req, res) {
    res.redirect('/');
  }
);
app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
})