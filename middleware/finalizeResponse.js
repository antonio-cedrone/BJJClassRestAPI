/*
    Middleware placed after all of the routes declarations to set the response.
*/

const finalizeResponse = (req, res, next) => {
    // Check if the query has been serviced.
    if (req.intermediateStatus) {
        res.status(req.intermediateStatus);

        if (req.intermediateBody) {
            res.json(req.intermediateBody);
        }
        else {
            res.end();
        }
    }
    else {
        next();
    }
}

module.exports = finalizeResponse;