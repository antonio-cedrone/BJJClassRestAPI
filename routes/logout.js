const express = require('express');
const router = express.Router();
const handleLogout = require('../controllers/logoutController.js');
const unsupportedMethodHandler = require('../middleware/ErrorHandlers/unsupportedMethodHandler');

/**
 * @openapi
{
    "paths": {
        "/logout/": {
            "get": {
                "tags": [
                    "authorization"
                ],
                "summary": "Logout user",
                "description": "If the user is logged in, log them out, otherwise, take no action",
                "operationId": "userLogout",
                "responses": {
                    "204": {
                        "description": "successful operation"
                    }
                }
            }
        }
    }
}
 */
router.route("/")
    .get(handleLogout)
    .all(unsupportedMethodHandler);

module.exports = router;