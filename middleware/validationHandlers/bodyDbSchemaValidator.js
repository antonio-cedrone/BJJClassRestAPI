/*
    Function that returns middleware which validates the request body against the mongoose schema
    passing an error to next with comma seperated validation errors if it does not pass.  As the schemas
    are set to strict throw in some cases an error will be thrown like if there are extra fields not in the schema.
*/

const bodyValidationHandler = (Element) => {
    return (req, res, next) => {
        try {
            const newElement = new Element(req.body);
            const validationError = newElement.validateSync();
            
            if (validationError) {
                let message = "";

                for (const key in validationError.errors) {
                    if (message !== "") {
                        message += ", ";
                    }

                    message += validationError.errors[key].message;
                }

                const error = new Error(message);
                throw error;
            }
            
            next();
        }
        catch (err) {
            const error = new Error(err.message)
            error.status = 400;
            next(error);
        }
    }
}

module.exports = bodyValidationHandler;