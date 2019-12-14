// Error wrapper to use in Express
const Errors = require("../../errors");
const db = require("../../models");

/** @function wrapAsync
 * This function wraps routes implementations to prevent the API from crashing when any exception is thrown.
 * It also contains requsition query and body validation, and database transaction management.
 *
 * @param {function} fn Route's implementation.
 * @param {Joi.Schema} [bodySchema=undefined] Joi Schema for Requisition's Body validation.
 * @param {Joi.Schema} [querySchema=undefined] Joi Schema for Requisition's Query validation.
 * @param {string} [transactionIsolationLevel=undefined] Transaction isolation level. Values: "SERIALIZABLE", "REPEATABLE_READ", "READ_COMMITTED", "READ_UNCOMMITTED". The param value must be undefined if the route will not open a transaction.
 * @returns
 */
const wrapAsync = (fn, bodySchema = undefined, querySchema = undefined, transactionIsolationLevel = undefined) => {
    return async (req, res, next) => {
        try {
            if (querySchema != undefined) {
                await querySchema.validateAsync(req.query).then(value => {
                    req.query = value;
                });
            }
        } catch (err) {
            if (err.isJoi != undefined) {
                if ((err.name = "ValidationError" && err.isJoi)) {
                    return next(new Errors.QueryJoiValidationError(err));
                }
            }

            return next(err);
        }

        try {
            if (bodySchema != undefined) {
                await bodySchema.validateAsync(req.body).then(value => {
                    req.body = value;
                });
            }
        } catch (err) {
            if (err.isJoi != undefined) {
                if ((err.name = "ValidationError" && err.isJoi)) {
                    return next(new Errors.BodyJoiValidationError(err));
                }
            }

            return next(err);
        }

        if (transactionIsolationLevel == undefined) {
            fn(req, res, next).catch(next);
        } else {
            let isolationLevel;
            switch (transactionIsolationLevel) {
                case "SERIALIZABLE":
                    isolationLevel = db.Sequelize.Transaction.ISOLATION_LEVELS.SERIALIZABLE;
                    break;
                case "REPEATABLE_READ":
                    isolationLevel = db.Sequelize.Transaction.ISOLATION_LEVELS.REPEATABLE_READ;
                    break;
                case "READ_COMMITTED":
                    isolationLevel = db.Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED;
                    break;
                case "READ_UNCOMMITTED":
                    isolationLevel = db.Sequelize.Transaction.ISOLATION_LEVELS.READ_UNCOMMITTED;
                    break;
                default:
                    return next(new Errors.CustomError({ message: "Invalid transaction isolation level." }));
            }

            try {
                db.sequelize
                    .transaction({ isolationLevel }, async t => {
                        await fn(req, res, next);
                    })
                    .catch(err => {
                        return next(err);
                    });
            } catch (err) {
                return next(err);
            }
        }
    };
};

module.exports = {
    wrapAsync
};
