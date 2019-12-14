const HttpStatus = require("../utils/http-status");

const _ = require("lodash");

/**
 * Default error class.
 *
 * @class CustomError
 * @extends {Error}
 */
class CustomError extends Error {
    constructor(customErrorObject) {
        super(customErrorObject.message);
        this.name = this.constructor.name + (customErrorObject.code == undefined ? "-" + customErrorObject.code : ""); // ensures that the error name will be the same as the class name

        if (customErrorObject.status == undefined) this.status = HttpStatus.INTERNAL_SERVER_ERROR;
        else this.status = customErrorObject.status;

        this.code = customErrorObject.code;

        Error.captureStackTrace(this, this.constructor); // ensures friendly error stack strace for this custom error class
    }

    getResponseJsonObject() {
        let jsonObject = {
            message: this.message
        };

        if (this.code != undefined) jsonObject.code = this.code;
        if (this.data != undefined) jsonObject.data = this.data;

        return jsonObject;
    }
}

/**
 * This class wraps Joi Validation Errors. The joi error object must be passed to this class in the constructor param
 *
 * @class JoiValidationError
 * @extends {CustomError}
 */
class JoiValidationError extends CustomError {
    parseJoiError(err) {
        return {
            error: {
                original: err._object,

                // gets only message and type of each error
                details: _.map(err.details, ({ message, type }) => ({
                    message: message.replace(/['"]/g, ""),
                    type
                }))
            }
        };
    }

    constructor(joiErrorObject, message = "Joi Validation Error") {
        super({ message, status: HttpStatus.UNPROCESSABLE_ENTITY });
        this.data = this.parseJoiError(joiErrorObject);
    }
}

/**
 * This class wraps Query params Joi Validation Errors. The joi error object must be passed to this class in the constructor param
 *
 * @class QueryJoiValidationError
 * @extends {JoiValidationError}
 */
class QueryJoiValidationError extends JoiValidationError {
    constructor(joiErrorObject) {
        super(joiErrorObject, `The query params did not match the Joi Schema.`);
        this.status = HttpStatus.BAD_REQUEST;
    }
}

/**
 *This class catch errors verify JWT Token.
 *
 * @class VerifyAuthError
 * @extends {CustomError}
 */
class VerifyAuthError extends CustomError {
    constructor(error, message = "Failed to verify JWT token") {
        super({ message, status: HttpStatus.UNPROCESSABLE_ENTITY });
    }
}

/**
 * This class wraps Body object Joi Validation Errors. The joi error object must be passed to this class in the constructor param
 *
 * @class BodyJoiValidationError
 * @extends {JoiValidationError}
 */
class BodyJoiValidationError extends JoiValidationError {
    constructor(joiErrorObject) {
        super(joiErrorObject, `The body object did not match the Joi Schema.`);
        this.status = HttpStatus.BAD_REQUEST;
    }
}

/**
 * This class can wrap third party modules errors, and NodeJs errors as well, by putting the entire error object inside the 'data' attribute
 *
 * @class InternalError
 * @extends {CustomError}
 */
class CustomInternalError extends CustomError {
    constructor(error) {
        super({ message: error.message }); // status isn't needed because the CustomError's constructor will assign status 500 by default
        this.data = { error };
    }
}

module.exports = {
    CustomError,
    CustomInternalError,
    JoiValidationError,
    BodyJoiValidationError,
    QueryJoiValidationError,
    VerifyAuthError
};
