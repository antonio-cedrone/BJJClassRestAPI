const express = require('express');
const router = express.Router();
const ajvSchemaValidator = require("../middleware/validationHandlers/ajvSchemaValidator");
const Controller = require('../controllers/dbModelController');
const User = require("../model/User");
const UserController = new Controller(User);
const unsupportedMethodHandler = require('../middleware/ErrorHandlers/unsupportedMethodHandler');

/**
 * @openapi
{
    "paths": {
        "/register/": {
            "post": {
                "tags": [
                    "authorization"
                ],
                "summary": "Register as a user",
                "description": "Creates a new user in the database with the provided username and password",
                "operationId": "registerUser",
                "requestBody": {
                    "description": "New user credentials",
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
                    "201": {
                        "description": "successful operation",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/User"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Request body does not match body schema"
                    },
                    "409": {
                        "description": "Username already exists in database"
                    }
                }
            }
        }
    }
}
 */
router.route("/")
    .post(ajvSchemaValidator(require("../libs/Schemas/authSchema"), "body"), require("../middleware/hashPassword"), UserController.addElement)
    .all(unsupportedMethodHandler);

module.exports = router;