const winston = require('winston');
const mongoose = require('mongoose');

const connectionString = process.env.DB;

module.exports = function () {
    mongoose.connect(connectionString,
        {
            useCreateIndex: true,
            useNewUrlParser:true,
            useUnifiedTopology:true
        })
        .then(() => winston.info("Connected to MongoDB"))
        .catch(() => winston.info("Error Connecting Database")) 
}