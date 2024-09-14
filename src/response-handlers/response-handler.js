const { SUCCESS_MSG, ERROR_MSG, BAD_REQUEST_MSG, NOT_FOUND_MSG, INTERNAL_SERVER_ERROR_MSG } = require("../constants/appMessages");
const { OK, CREATED, BAD_REQUEST, UNAUTHORIZED, FORBIDDEN, NOT_FOUND, UN_PROCESSABLR_ENTITY, INTERNAL_SERVER_ERROR } = require("../constants/httpCodes");


/**
 * 200 - NOTFOUND
 * ---------------
 * @param {*} res
 * @param {*} message
 * @returns
 */

exports.ok200 = (res, message, data) => {
    let result =  data ?  data :  null;
    return res.status(OK).send({status:"OK", message:message, result});
  };
  
  /**
   * 201 - CREATED
   * ---------------
   * @param {*} res
   * @param {*} message
   * @returns
   */
  
  exports.created201 = (res, message) => {
    return res.status(CREATED).send(new BadRequestError(message));
  };
  
  /**
   * 400 - BAD REQUEST
   * ------------------
   * @param {*} res
   * @param {*} message
   * @returns
   */
  exports.badRequet400 = (res, msg, data) => {
    let result =  data ?  data :  null;
    let message = msg ?  msg : BAD_REQUEST_MSG;

    return res.status(BAD_REQUEST).send({status:"OK", message, result});
  };
  
  /**
   * UN-AUTHORIZED 401
   * ------------------
   * @param {*} res
   * @param {*} message
   * @returns
   *
   */
  exports.unAuthorized401 = (res, message) => {
    return res.status(UNAUTHORIZED).send(new BadRequestError(message));
  };
  
  /**
   * NOTFOUND 403
   * ---------------
   * @param {*} res
   * @returns
   */
  exports.forbidden403 = (res, message) => {
    return res.status(FORBIDDEN).send(new BadRequestError(message));
  };
  
  /**
   * NOTFOUND 404
   * ---------------
   * @param {*} res
   * @returns
   */
  exports.notFound404 = (res, msg, data) => {
    let result =  data ?  data :  null;
    let message = msg ?  msg : NOT_FOUND_MSG;
    return res.status(BAD_REQUEST).send({status:"OK", message, result});
  };
  
  /**
   * UN PROCESSED ENTRY 422
   * ----------------------
   * @param {*} res
   * @returns
   */
  exports.unProcessedEntry422 = (res, message) => {
    return res
      .status(HttpCodes.UN_PROCESSABLR_ENTITY)
      .send(new BadRequestError(message));
  };
  
  /**
   * 500 - INTERNAL SERFVER ERROR
   * -----------------------------
   * @param {*} res
   * @returns
   */
  exports.internalServerError500 = (res, msg, data) => {
    let result =  data ?  data :  null;
    let message = msg ?  msg : INTERNAL_SERVER_ERROR_MSG;

    return res.status(INTERNAL_SERVER_ERROR).send({status:"Error", message:message, result});

    
  };
  
  /**
   * CUSTOM ERROR
   * -------------
   * @param {*} res
   * @returns
   */
  exports.customError = (res, statusCode, status, message, data) => {
    status = status ?  status: "";
    message = message ? message : "";
    let result =  data ?  data :  null;
    return res.status(statusCode).send({status, message, result});
  };
  