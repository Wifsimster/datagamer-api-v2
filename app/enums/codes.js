// Manage generic error object for response
// These codes try to refere to HTTP codes
var CODE = {

    SUCCESS: {code: 200, message: "Success !"},
    SUCCESS_POST: {code: 201, message: "Success, new resource added !"},
    SUCCESS_PUT: {code: 202, message: "Success, existing resource updated !"},
    SUCCESS_DELETE: {code: 204, message: "Success, no content to return !"},

    NOT_MODIFIED: {code: 304, message: "No error but nothing happened here !"},

    BAD_REQUEST: {code: 400, message: "Bad request syntax !"},
    FORBIDDEN: {code: 403, message: "Invalid API key !"},
    NOT_FOUND: {code: 404, message: "Resource doesn't exist in database !"},
    PRECONDITION_FAILED: {code: 410, message: "Precondition failed, check header content !"},
    MISSING_DATA: {code: 411, message: "Mandatory data missing !"},
    ALREADY_EXIST: {code: 412, message: "Resource already exist in database !"},

    SERVER_ERROR: {code: 500, message: "Server error !"},
};

module.exports = CODE;