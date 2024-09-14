const express = require('express');
const cors =  require('cors');
const app = express();
const dotenv = require('dotenv');
const path =  require('path');

app.use(cors());
dotenv.config();

require('./src/startup/routes')(app);
require('./src/startup/db')();

app.use(express.static('public'));

app.get('/', (req,res) => {
   res.status(200).send("ok");
})

app.get('/health', (req,res) => {
    res.status(200).send("health");
 })

const port = process.env.PORT || 3500;

app.listen(port, function () {
    console.log(`Server is listening on port ${port}`);
});






