const express = require('express');
const helmet =  require('helmet');
const logger = require('morgan');

module.exports = function (app) {
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(logger('dev'));
    app.use(helmet);
    // app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
}
