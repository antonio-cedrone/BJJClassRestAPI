const roles = require("../config/roles");

/*
    Credit to Dave Grey for this authorization code located in this Github Resource:
    https://github.com/gitdagray/mongo_async_crud

    Middleware to limit the power of a admin and owner to only being able to give
    permissions to a user below their level (in other words, an admin cannot give someone
    admin or owner permissions, only editor and below).
*/

const limitAdminPermission = (req, res, next) => {
    // Check if req.body has role (if it does not it will default to user).
    if (req.body.role) {
        // Do not allow the request if someone is trying to give permissions at their level or higher.
        if (roles[req.role] <= roles[req.body.role]) {
            const error = new Error("Insufficient permissions to complete this action");
            error.status = 403;
            return next(error);
        }
    }
    
    next();
}

module.exports = limitAdminPermission;