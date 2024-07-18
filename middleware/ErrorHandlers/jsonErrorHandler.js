/*
    Error middleware that receives errors and structures the response object to match the provided information
    including any provided header information, the status code and the body which is the error message in json format.
*/

const errorHandlerMiddleware = (err, req, res, next) => {
    if (err.headerInfo) {
        keys = Object.keys(err.headerInfo);
        if (keys) {
            for (i = 0; i < keys.length; i++) {
                res.set(keys[i], err.headerInfo[keys[i]]);
            }
        }   
    }
    res.status(err.status || 500);

    if (err.message) return res.json({message: err.message});
    
    res.end();
}

module.exports = errorHandlerMiddleware;