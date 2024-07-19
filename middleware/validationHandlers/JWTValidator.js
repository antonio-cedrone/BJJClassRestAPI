const jwt = require('jsonwebtoken');
const ErrorWithHeaderInfo = require("../../libs/CustomErrors/ErrorWithHeaderInfo.js");

/*
    Credit to Dave Grey for this authorization code located in this Github Resource:
    https://github.com/gitdagray/mongo_async_crud

    Middleware that confirms if the JWT token in the header of the request is valid.
*/

const verifyJWT = (req, res, next) => {
    // Check if the query has already been serviced.
    if (req.intermediateStatus) {
        return next();
    }
    
    // Confirm that the authorization paramater is a bearer type.
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader?.startsWith('Bearer ')) {
        const error = new ErrorWithHeaderInfo("Invalid authorization header");
        error.status = 401;
        error.headerInfo = {"WWW-Authenticate": "Bearer"};
        return next(error);
    }
    
    const token = authHeader.split(' ')[1];

    // Verify the jwt token and if valid add the data to the request object to be passed along to the next middleware.
    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                const error = new Error("Invalid access token provided");
                error.status = 401;
                return next(error);
            }
            
            //req.user = decoded.UserInfo.username;
            req.role = decoded.UserInfo.role;
            next();
        }
    );
}

module.exports = verifyJWT;