// Manage generic error object for response
var ERROR = {
    FORBIDDEN: {code: 403, message: "Invalid API key !"},
    NOT_FOUND: {code: 404, message: "Resource doesn't exist in database !"},
    PRECONDITION_FAILED: {code: 410, message: "Precondition failed, check header content !"},
    MISSING_DATA: {code: 411, message: "Mandatory data missing !"},
    ALREADY_EXIST: {code: 412, message: "Resource already exist in database !"},
    SERVER_ERROR: {code: 500, message: "Server error !"},
};

module.exports = ERROR;