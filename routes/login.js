const express = require('express');
const router = express.Router();
const ajvSchemaValidator = require("../middleware/validationHandlers/ajvSchemaValidator");
const handleLogin = require('../controllers/loginController');
const User = require("../model/User");
const Controller = require("../controllers/dbModelController");
const UserController = new Controller(User);
const setFilter = require("../middleware/SettingFiltersHandlers/setFilterFromRequest")
const unsupportedMethodHandler = require('../middleware/ErrorHandlers/unsupportedMethodHandler');

/**
 * @openapi
{
    "paths": {
        "/login/": {
            "post": {
                "tags": [
                    "authorization"
                ],
                "summary": "Login",
                "description": "Login using a username and password",
                "operationId": "userLogin",
                "requestBody": {
                    "description": "User credentials",
                    "content": {
                        "application/json": {
                            "schema": {
                                "type": "object",
                                "properties": {
                                    "username": {
                                        "type": "string",
                                        "unique": "true",
                                        "required": "true"
                                    },
                                    "password": {
                                        "type": "string",
                                        "required": "true",
                                        "maxLength": 40
                                    }
                                }
                            }
                        }
                    },
                    "required": true
                },
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "headers": {
                            "set-cookie": {
                                "description": "Contains the session cookie named `jwt`. Pass this cookie back when refreshing access token.",
                                "schema": {
                                    "type": "string"
                                }
                            }
                        },
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
                                            "type": "string"
                                        }
                                    }
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Request body does not match body schema"
                    },
                    "401": {
                        "description": "Incorrect password"
                    },
                    "404": {
                        "description": "Username is not found in database"
                    }
                }
            }
        }
    }
}
 */
router.route("/")
    .post(ajvSchemaValidator(require("../libs/Schemas/authSchema"), "body"), setFilter({"username": "body.username"}), UserController.getOne, handleLogin)
    .all(unsupportedMethodHandler);

module.exports = router;