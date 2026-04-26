const config = require('../startup/config');
const { User } = require('../models/user.model');
const express = require('express');
const _ = require("lodash");
const bcrypt = require('bcrypt');
const router = express.Router();
const { INVALID_INPUT } = require('../helpers/app_messages');

router.post('/', async (req, res) => {

    const isValidUser = validate(req.body);

    INVALID_INPUT.message = "'Invalid user name or password.'"

    if (!isValidUser) return res.status(400).send(INVALID_INPUT);

    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send(INVALID_INPUT);

    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword) {
        return res.status(400).send(INVALID_INPUT);
    }

    const token = await generateAuthToken(user._id);
    res.status(200).send(token);

});

function validate(req) {
    const { email, password } = req;

    if (!email || !password)
        return false;

    return true;

};

generateAuthToken = async (id) => {
    const token = jwt.sign({ _id: id }, process.env.NODE_SECRET_KEY) // config.get('jwtPrivateKey'));
    return token;
}



module.exports = router;