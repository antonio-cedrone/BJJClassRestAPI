const validate = require("../../libs/Schemas/basicHeaderSchema");
const ErrorWithHeaderInfo = require("../../libs/CustomErrors/ErrorWithHeaderInfo");

/*
    Middleware that validates the request header for all requests that are received against the ajv headerSchema 
    and returns the correct status code and message depending on what failed (currently there is only content-type 
    in the header that is being validated).
*/

const allRequestHeaderValidator = (req, res, next) => {
    // Validate the header.
    const valid = validate(req.headers);

    // Check if the header is valid.
    if (!valid) {
        const err = validate.errors[0];

        // Check if the error is in concerning the content-type (currently this is always the case).
        if (err.instancePath === "/content-type") {
            // Return a 415 code and put the allowed content-type in the error headerInfo so it can later be included in the response.
            const error = new ErrorWithHeaderInfo(err.instancePath.replace("/", "") + " " + err.message + " or not included"); 
            error.status = 415; 
            error.headerInfo = {'Accept': err.params.allowedValues.toString()}; 
           return next(error); 
        }
    }
    
    next();
}

module.exports = allRequestHeaderValidator;