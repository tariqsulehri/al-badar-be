const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');
const _ = require("lodash");
const bcrypt = require('bcrypt');

const { User } = require('../../models/user.model');
const { INVALID_INPUT } = require('../../helpers/app_messages');


export const createUser = async(user)  => {
    if (!isValidUser) return res.status(400).send(INVALID_INPUT);

    let user = await User.findOne({ email: req.body.email });

    if (user) {

        INVALID_INPUT.message = "User allready registered with this email...";
        return res.status(400).send(INVALID_INPUT);
    }

    user = new User(_.pick(req.body, ['name', 'email', 'password']));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    await user.save()

    let token = await generateAuthToken(user._id);
    token = await jwt.sign({ _id: user._id }, process.env.NODE_SECRET_KEY);
    res.header('x-auth-token', token).status(200).send(_.pick(user, ['_id', 'name', 'email', 'password']));

};

router.get('/me', auth, async (req, res) => {
    let user = await User.findById(req.user._id).select('-password');
    res.send(user);
});


function validate(req) {
    const { email, password } = req;

    if (!email || !password)
        return false;

    return true;

};

generateAuthToken = async (id) => {
    const token = jwt.sign({ _id: id }, process.env.NODE_SECRET_KEY)//'node_secureJwtKey') // config.get('jwtPrivateKey'));
    return token;
}

/**
 * Find a user by email or username (for duplication check)
 * @param {string} email
 * @param {string} username
 * @returns {Promise<User|null>}
 */
const getUserByEmailOrUsername = async (email, username) => {
    return await User.findOne({
        $or: [
            { email: email },
            { username: username }
        ]
    });
};

module.exports = router;
module.exports.getUserByEmailOrUsername = getUserByEmailOrUsername;