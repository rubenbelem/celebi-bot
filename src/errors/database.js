const HttpStatus = require("../utils/http-status");

module.exports.DB001 = {
    status: HttpStatus.NOT_FOUND,
    code: "DB-001",
    message: "Connection Failed with Database."
};

module.exports.DB002 = {
    status: HttpStatus.NOT_FOUND,
    code: "DB-002",
    message: "Not Found in Database."
};
