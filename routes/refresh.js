const express = require('express');
const router = express.Router();
const handleRefreshToken = require('../controllers/refreshTokenController');
const unsupportedMethodHandler = require('../middleware/ErrorHandlers/unsupportedMethodHandler');

/**
 * @openapi
{
    "paths": {
        "/refresh/": {
            "get": {
                "security": [{
                    "cookieAuth": []
                }],
                "tags": [
                    "authorization"
                ],
                "summary": "Refresh user access token",
                "description": "Refresh cookie is used to create new access token for the user",
                "operationId": "refreshToken",
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                    "properties": {
                                        "role": {
                                            "type": "string",
                                            "example": "user"
                                        },
                                        "accessToken": {
                                            "type": "string",
                                            "example": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJVc2VySW5mbyI6eyJ1c2VybmFtZSI6InNhbXNvbiIsInJvbGUiOiJ1c2VyIn0sImlhdCI6MTcyMTE4MzQwMywiZXhwIjoxNzIxMTgzNDMzfQ.g0lEghjWXgV4yaCzMca7t0WLjyGT7D29np8GJhRwI5o"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Refresh token is missing from request or resulted in verification error"
                    },
                    "403": {
                        "description": "Request token provided cannot be matched to a user"
                    }
                }
            }
        }
    }
}
 */
router.route("/")
    .get(handleRefreshToken)
    .all(unsupportedMethodHandler);

module.exports = router;