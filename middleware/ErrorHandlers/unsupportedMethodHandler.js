const ErrorWithHeaderInfo = require("../../libs/CustomErrors/ErrorWithHeaderInfo");

/*
    Middleware to be used for all methods not explicity serviced at a route that provides information
    on allowable headers for that route to the error object.
*/

const unsupportedMethodHandler = (req, res, next) => {
    // Check if the request has been serviced by seeing if a intermediate value was added to the request.
    if (req.intermediateStatus) {
        return next();
    }

    const error = new ErrorWithHeaderInfo(req.method + " not available at this path");
    error.status = 405;
    
    // Produce a list of allowable methods available at this path which is added to headerInfo for later addition to the response.
    allowedMethods = Object.keys(req.route.methods).filter((item) => item != '_all').map(function(x){ return x.toUpperCase(); }).toString();
    if (allowedMethods.length === 0) {
        error.headerInfo = {'Allow': "OPTIONS"}
    }
    else if (allowedMethods.includes("GET")){
        error.headerInfo = {'Allow': allowedMethods.replace(" ", "") + ",HEAD,OPTIONS"}
    }
    else {
        error.headerInfo = {'Allow': allowedMethods.replace(" ", "") + ",OPTIONS"}
    }
    next(error);
}

module.exports = unsupportedMethodHandler;