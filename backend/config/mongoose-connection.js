require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URL).then(() => {
        console.log('Connected to DB');
    })
    .catch((err) => {
        console.log('Error connecting to DB:', err);
    });

module.exports = mongoose.connection;