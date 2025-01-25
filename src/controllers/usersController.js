const { adapterRequest } = require("../helpers/adapterRequest");
const userService = require("../services/database/userService");
const authHelper = require("../helpers/authHelper");
const AppMessages = require("../constants/appMessages");

const { successResponse, internalServerError, genericErrorResponse, customSuccessResponse, badRequestResponse } = require("../helpers/responseHelper");

/**
 * @function createUser
 * @description Handles the creation of a new user account. Checks if the user already exists by email,
 *              encrypts the password, and creates the user account if not already registered.
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @returns {Object} Returns a success response with the created user details, or an error response
 */
exports.createUser = async (req, res) => {
  const httpRequest = adapterRequest(req); // Adapt the request for internal use

  try {
    const { body } = httpRequest;
    const { username, email, password, role } = body;

    // Check if user already exists by email
    const userExists = await userService.getUserByEmail(email);
    if (userExists) {
      return genericErrorResponse(res, AppMessages.APP_DUPLICATE);
    }

    // Encrypt the user's password
    const encryptedPassword = await authHelper.encryptString(password);
    const newUser = await userService.createUserAccount(username, email, encryptedPassword, role);

    return successResponse(res, newUser);
  } catch (error) {
    // Handle any errors and return an internal server error response
    return internalServerError();
  }
};

/**
 * Handles the login process by validating user credentials and generating an authentication token.
 * 
 * @param {Object} req - The HTTP request object, containing user credentials.
 * @param {Object} res - The HTTP response object, used to return the result to the client.
 * @returns {Object} - The response with a success or error message.
 */
exports.login = async (req, res) => {
  let httpRequest = adapterRequest(req);

  try {
    let { body } = httpRequest;
    
    let result = await userService.getUserByEmail(body.email);
    if (!result) {
      return genericErrorResponse(res, AppMessages.IVALID_USER_CREDENTIALS);
    }

    const isValidUser = await authHelper.isValidUser(body.password, result.password);
    if (!isValidUser) {
      return genericErrorResponse(res, AppMessages.APP_ACCESS_DENIED);
    }
    res = await authHelper.addAuthTokenInResponseHeader(result, res);
     return successResponse(res);
  } catch (error) {
    return internalServerError(res);
  }
};


/**
 * Fetches the list of users and returns them in the response.
 * 
 * @param {Object} req - The HTTP request object, though it is not used in this function.
 * @param {Object} res - The HTTP response object, used to return the list of users or an error.
 * @returns {Object} - The response with a success message and the list of users, or an error message in case of failure.
 */
exports.usersList = async (req, res) => {
  try {
    let users = await userService.getUsers();
    return successResponse(res, users);
  } catch (error) {
    return internalServerError();
  }
};


/**
 * Fetches a user by the provided ID and returns the user details in the response.
 * 
 * @param {Object} req - The HTTP request object containing the user ID in the URL parameters.
 * @param {Object} res - The HTTP response object, used to return the user details or an error.
 * @returns {Object} - The response with a success message and the user details, or an error message in case of failure.
 */

exports.getUser = async (req, res) => {
  try {
   
    let id = req.params["id"];
    let user = await userService.getUserByID(id);
    return successResponse(res, user);

  } catch (error) {
    console.log("in error",error);
    return internalServerError();
  }
};


/**
 * Deletes a user by the provided ID and returns a success response.
 * 
 * @param {Object} req - The HTTP request object containing the user ID in the URL parameters.
 * @param {Object} res - The HTTP response object, used to return a success message or an error.
 * @returns {Object} - The response indicating success or failure of the delete operation.
 */
exports.deleteUser = async (req, res) => {
  try {
    //Api Call and Compose Response Response
    let id = req.params["id"];
    await userService.deleteUser(id);
    return successResponse(res);
  } catch (error) {
    return internalServerError();
  }
};


/**
 * Changes the password of a user after validate and change their current password.
 * 
 * @param {Object} req - The HTTP request object containing the user ID, old password, and new password in the body.
 * @param {Object} res - The HTTP response object, used to return the result of the password change or an error.
 * @returns {Object} - The response indicating success or failure of the password update.
 */
exports.changeUserPassword = async (req, res) => {
  try {
    const { body } = req;

    let exists = await userService.getUserAllDataByID(body.id);
    if (!exists) {
      return genericErrorResponse(res, AppMessages.IVALID_USER_CREDENTIALS);
    }

    let isValidUser = await authHelper.isValidUser(body.oldPassword, exists.password);
   
    if (!isValidUser) {
      return genericErrorResponse(res, AppMessages.IVALID_USER_CREDENTIALS);
    }

    let passwordHash = await authHelper.encryptString(body.newPassword);
    let result = await userService.updateUserPassword(body.id, passwordHash);

    return successResponse(res, result);
  } catch (error) {
    return internalServerError();
  }
};


/**
 * Updates the details of a user based on the provided data in the request body.
 * 
 * @param {Object} req - The HTTP request object containing the user ID and updated data in the body.
 * @param {Object} res - The HTTP response object, used to return a success message or an error.
 * @returns {Object} - The response indicating success or failure of the update operation.
 */
exports.updateUser = async (req, res) => {
  let httpRequest = adapterRequest(req);

  try {
    let { body } = httpRequest;
    let exists = await userService.getUserByID(body.id);
    if (!exists) {
      return genericErrorResponse(res, AppMessages.APP_RESOURCE_NOT_FOUND);
    }

    return successResponse(AppMessages.RECORD_SUCCESSFULY_UPDATED);
  } catch (error) {
    return internalServerError();
  }
};


/**
 * Send OTP for MFA to user.
 * 
 * @param {Object} req - The HTTP request object containing the user ID and updated data in the body.
 * @param {Object} res - The HTTP response object, used to return a success message or an error.
 * @returns {Object} - The response indicating success or failure of the update operation.
 */
exports.resendOTP = async (req, res) => {
  let httpRequest = adapterRequest(req);

  try {
    let { body } = httpRequest;
    body.otp = await authHelper.generateOTP();
    let result = await userService.updateOTP(body);

    if (!result[0][0].affected_rows || result[0][0].affected_rows === 0) {
      return genericErrorResponse(res,appMessages.ERROR_PIN_GENERATION )
    }

    return customSuccessResponse(res,appMessages.PIN_SUCCESSFULY_GENERATED );

  } catch (error) {
    return internalServerError();
  }
};


/**
 * confirm OTP for MFA to user.
 * 
 * @param {Object} req - The HTTP request object containing the user ID and updated data in the body.
 * @param {Object} res - The HTTP response object, used to return a success message or an error.
 * @returns {Object} - The response indicating success or failure of the update operation.
 */

exports.confirmOTP = async (req, res) => {
  let httpRequest = adapterRequest(req);

  try {
    let { body } = httpRequest;
    let result = await userService.confirmOTP(body);

    if (!result[0][0].affected_rows || result[0][0].affected_rows === 0) {
      return genericErrorResponse(res,appMessages.ERROR_INVALID_PIN)
    }

    return customSuccessResponse(res,appMessages.PIN_SUCCESSFULY_CONFIRMED );

  } catch (error) {
    return internalServerError();
  }
};
