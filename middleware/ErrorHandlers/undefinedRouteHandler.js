/*
    Middleware placed after all of the routes declarations to handle any route that is not serviced.
*/

const undefinedRouteHandler = (req, res, next) => {
    const error = new Error(req.path + " undefined");
    error.status = 404;
    next(error);
}

module.exports = undefinedRouteHandler;