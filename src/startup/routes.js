const express = require('express');
const cors =  require('cors');
const auth = require('../routes/auth');
const home = require('../routes/home');
const users = require('../routes/users');

const provence = require('../routes/provence');
const city =  require('../routes/city');
const area =  require('../routes/area');
const subArea = require("../routes/subArea");

const slides =  require("../routes/slides");
const party =  require('../routes/party')
const quotes =  require('../routes/quotes')
const invoices =  require('../routes/invoice');

module.exports = function (app) {
    app.use(cors());
    app.use(express.json());
    
    app.use('/api/auth', auth);
    app.use('/api/home', home);
    app.use('/api/users', users);
    app.use('/api/provence', provence);
    app.use('/api/city', city);
    app.use('/api/area', area);
    app.use('/api/subarea', subArea);
    app.use('/api/party',party);
    app.use('/api/slide', slides); 
    app.use('/api/quote', quotes); 
    app.use('/api/invoice', invoices); 
}