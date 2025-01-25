const jwt = require("jsonwebtoken");const bcrypt = require("bcrypt");


/**
 * Encrypts a given string using bcrypt.
 *
 * @param {string} sourceString - The string to be encrypted.
 * @returns {Promise<string>} - A promise that resolves to the encrypted string.
 *
 * @example
 * const hashedString = await encryptString('myPassword123');
 * console.log(hashedString); // Outputs the encrypted string
 */
exports.encryptString = async (sourceString) => {
  const salt = await bcrypt.genSalt(10);
  let encryptedString = await bcrypt.hash(sourceString, salt);
  return encryptedString;
};


/**
 * Generates a 4-digit one-time password (OTP).
 *
 * @returns {Promise<number>} - A promise that resolves 4 digit random pin.
 *
 * @example
 * const otp = await generateOTP();
 * console.log(otp); // Outputs a 4-digit OTP
 */
exports.generateOTP = async () => {
  const otp = Math.floor(1000 + Math.random() * 9000);
  return otp;
};


/**
 * Generates an authentication token using JWT with the provided user data.
 *
 * @param {Object} data - The user data object.
 * @param {string} data.id - The user ID.
 * @param {string} data.role - The user role.
 * @param {string} data.email - The user email.
 * @returns {Promise<string>} - A promise that resolves to the generated JWT token.
 *
 * @example
 * const token = await generateAuthTokenWithObject({ id: '123', role: 'admin', email: 'user@example.com' });
 * console.log(token); // Outputs the JWT token
 */


exports.generateAuthTokenWithObject = async (data) => {
  const token = jwt.sign(
    {
      _id: data.id,
      role: data.role,
      email: data.email,
    },
    process.env.NODE_SECRET_KEY
  ); 
  return token;
};




/**
 * Adds an authentication token to the response header.
 *
 * @param {Object} data - The user data object.
 * @param {Object} resObject - The response object.
 * @param {string} data.id - The user ID.
 * @param {string} data.role - The user role.
 * @param {string} data.email - The user email.
 * @returns {Promise<Object>} - A promise that resolves to the updated response object.
 *
 * @example
 * const res = await addAuthTokenInResponseHeader({ id: '123', role: 'admin', email: 'user@example.com' }, res);
 * console.log(res); // Outputs the response object with the added "x-auth-token" header
 */
exports.addAuthTokenInResponseHeader = async (data, resObject) => {
  let token = await this.generateAuthTokenWithObject(data);
  data.token = token;
  resObject.header("x-auth-token", token);
  return resObject;
};



/**
 * Validates if the provided password matches the encrypted password.
 *
 * @param {string} requestPassword - The password provided by the user.
 * @param {string} encryptedPassword - The encrypted password stored in the database.
 * @returns {Promise<boolean>} - A promise that resolves to a boolean indicating whether the password is valid.
 *
 * @example
 * const isValid = await isValidUser('userPassword', 'encryptedPasswordFromDB');
 * console.log(isValid); // Outputs true or false
 */
exports.isValidUser = async (requestPassword, encryptedPassword, responseObject) => {
  let isValidPassword = await bcrypt.compare(requestPassword, encryptedPassword);
  return isValidPassword;
};
