/*
    Function that returns middleware which validates an object (item) against the provided ajv schema.
    If the object fails validation an error is passed to next containing all of the validation errors found as a single 
    comma seperated string.

    Note:
    The use for this function is to compare request content (from the body, parameters, or query) to a schema.  It is not 
    used for header data like cookies or content-type as this information (usually) requires more specific error
    handling behaviour (such as a different http error code).
*/

const ajvValidationHandler =  (validate, item) => { 
    return (req, res, next) => {
        // Validate the part of the request passed to the function.
        const valid = validate(req[item]);

        // Check if validation was passed.
        if (!valid) {
            let message = "";

            // Join the validation errors as a comma-seperated string and set it as the error.message.
            validate.errors.forEach(element => {
                if (message !== "") {
                    message += ", ";
                }
                if (element.instancePath !== '') {
                    message += element.instancePath.replace("/", "") + " " + element.message;
                }
                else {
                    message += element.message;
                }
            });
            const error = new Error(message); 
            error.status = 400; 
            return next(error); 
        }
        
        next();
    }
}

module.exports = ajvValidationHandler;