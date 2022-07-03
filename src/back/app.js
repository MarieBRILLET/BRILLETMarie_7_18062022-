//import
const express = require('express');
const helmet = require('helmet');

//importing the routes
const userRoutes = require('../routes/user');

//creating the app
const app = express();

//Problem CROSS ORIGIN
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST, PUT, DELETE, PATCH, OPTIONS'
    );
    next();
});

// callind database
const db = require("./models");
db.sequelize.sync();

//using the routes
app.use('/images', express.static(path.join(__dirname, 'images')));
app.use('/api/auth', authRoutes);
app.use('/api/users', auth, userRoutes);
app.use('/api/articles', auth, articleRoutes);
app.use('/api/likes', auth, likeRoutes);
app.use('/api/comments', auth, commentRoutes);

module.exports = app;