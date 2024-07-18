const roles = require("../config/roles");

/*
    Credit to Dave Grey for this authorization code located in this Github Resource:
    https://github.com/gitdagray/mongo_async_crud

    Function that returns middleware which checks if the requester has the minimum level of credentials
    needed to access the resource.
*/

const verifyRoles = (minimumRole) => {
    return (req, res, next) => {
        if (!req?.role) {
            const error = new Error("Invalid Role");
            error.status = 401;
            return next(error);
        }

        if (roles[req.role] < roles[minimumRole]) {
            const error = new Error("Insufficient permissions to complete this action");
            error.status = 403;
            return next(error);
        }
        
        next();
    }
}

module.exports = verifyRoles;