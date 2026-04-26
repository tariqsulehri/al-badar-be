
const HttpCodes = require("../constants/httpCodes");
const SuccessResponse = require("../composer/success-response.js");
const ErrorResponse = require("../composer/error-response.js");
const AppMessages = require("../constants/appMessages");
// const badRequestResponse = require("../composer/");

exports.successResponse = (res, data ) => {
    return res.status(HttpCodes.OK).send(
        new SuccessResponse(AppMessages.SUCCESS, data || null)
    );
}

exports.badRequestResponse = (res) => {
    return res.status(HttpCodes.BAD_REQUEST.send(
        new ErrorResponse(AppMessages.BAD_REQUEST)
    ));
}

exports.customSuccessResponse = (res, data , message) => {
    return res.status(HttpCodes.OK).send(
        new SuccessResponse(message, data || null)
    );
}



exports.internalServerError = (res) => {
    return res.status(HttpCodes?.INTERNAL_SERVER_ERROR).send(
        new ErrorResponse(AppMessages.INTERNAL_SERVER_ERROR)
      );
}

exports.genericErrorResponse = (res, message) => {
    return res.status(HttpCodes.INTERNAL_SERVER_ERROR).send(
        new ErrorResponse(message)
      );
}

