const express = require('express');
const router = express.Router();
const ajvSchemaValidator = require("../../middleware/validationHandlers/ajvSchemaValidator")
const bodyDbSchemaValidator = require("../../middleware/validationHandlers/bodyDbSchemaValidator");
const unsupportedMethodHandler = require('../../middleware/ErrorHandlers/unsupportedMethodHandler');
const Position = require("../../model/Position");
const Controller = require("../../controllers/dbModelController");
const positionsController = new Controller(Position);
const setFilter = require("../../middleware/SettingFiltersHandlers/setFilterFromRequest");
const verifyRoles = require("../../middleware/verifyRoles");
const standardMethodRoles = require("../../config/standardMinRoles");

/**
 * @openapi
{
    "paths": {
        "/position/": {
            "get": {
                "security": [{
                    "bearerAuth": []
                }],
                "tags": [
                    "position"
                ],
                "summary": "Retrieves all positions",
                "description": "Returns all positions present in the database",
                "operationId": "getAllPositions",
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Position"
                                    }
                                }
                            }
                        }
                    },
                    "401": {
                        "description": "Invalid authorization header, JWT token, or role"
                    },
                    "403": {
                        "description": "Insufficient permissions to complete action"
                    },
                    "404": {
                        "description": "No position data found"
                    }
                }
            },
            "post": {
                "security": [{
                    "bearerAuth": []
                }],
                "tags": [
                    "position"
                ],
                "summary": "Add a new position",
                "description": "Add a new position to the database by providing a request body that matches the position schema",
                "operationId": "addNewPosition",
                "requestBody": {
                    "description": "Conforms to the Position schema",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Position"
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
                                    "$ref": "#/components/schemas/Position"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Request body violates position schema (does not include unique constraints)"
                    },
                    "401": {
                        "description": "Invalid authorization header, JWT token, or role"
                    },
                    "403": {
                        "description": "Insufficient permissions to complete action"
                    },
                    "409": {
                        "description": "ObjectId or name of position already exist in database"
                    }
                }
            }
        }
    }
}
 */
router.route('/')
    .get(verifyRoles(standardMethodRoles["GET"]), positionsController.getAll)
    .post(verifyRoles(standardMethodRoles["POST"]), bodyDbSchemaValidator(Position), positionsController.addElement)
    .all(unsupportedMethodHandler);

/**
 * @openapi
{
    "paths": {
        "/position/{_id}": {
            "get": {
                "security": [{
                    "bearerAuth": []
                }],
                "tags": [
                    "position"
                ],
                "summary": "Find position by _id",
                "description": "Returns a single position",
                "operationId": "getPositionById",
                "parameters": [
                    {
                        "name": "_id",
                        "in": "path",
                        "description": "mongodb objectId of position",
                        "required": "true",
                        "schema": {
                            "type": "string",
                            "example": "668cf2ce1e220d3ec6ab3f8a"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "$ref": "#/components/schemas/Position"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "_id parameter is malformed"
                    },
                    "401": {
                        "description": "Invalid authorization header, JWT token, or role"
                    },
                    "403": {
                        "description": "Insufficient permissions to complete action"
                    },
                    "404": {
                        "description": "No position data found"
                    }
                }
            },
            "put": {
                "security": [{
                    "bearerAuth": []
                }],
                "tags": [
                    "position"
                ],
                "summary": "Update position by _id",
                "description": "Updates a single position in the database",
                "operationId": "updatePositionById",
                "requestBody": {
                    "description": "Conforms to the Position schema",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Position"
                            }
                        }
                    },
                    "required": true
                },
                "parameters": [
                    {
                        "name": "_id",
                        "in": "path",
                        "description": "mongodb objectId of position",
                        "required": "true",
                        "schema": {
                            "type": "string",
                            "example": "668cf2ce1e220d3ec6ab3f8a"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "object",
                                	"properties": {
                                    	"message": {"type": "string", "default": "No changes made"}
                                	}
                                }
                            }
                        }
                    },
                  	"204": {
                      	"description": "database updated successfully"
					},
                    "400": {
                        "description": "_id parameter is malformed or request body violates position schema (does not include unique constraints)"
                    },
                    "401": {
                        "description": "Invalid authorization header, JWT token, or role"
                    },
                    "403": {
                        "description": "Insufficient permissions to complete action"
                    },
                    "404": {
                        "description": "No position data found"
                    }
                }
            },
            "delete": {
                "security": [{
                    "bearerAuth": []
                }],
                "tags": [
                    "position"
                ],
                "summary": "Deletes a position by _id",
                "description": "Delete a single position from the database",
                "operationId": "deletePositionById",
                "parameters": [
                    {
                        "name": "_id",
                        "in": "path",
                        "description": "mongodb objectId of position",
                        "required": "true",
                        "schema": {
                            "type": "string",
                            "example": "668cf2ce1e220d3ec6ab3f8a"
                        }
                    }
                ],
                "responses": {
                    "204": {
                        "description": "successful operation"
                    },
                    "400": {
                        "description": "_id parameter is malformed"
                    },
                    "401": {
                        "description": "Invalid authorization header, JWT token, or role"
                    },
                    "403": {
                        "description": "Insufficient permissions to complete action"
                    },
                    "404": {
                        "description": "ObjectId does not exist in the positions collection"
                    }
                }
            }
        }
    }
}
 */
router.route('/:_id')
    .all(ajvSchemaValidator(require("../../libs/Schemas/requestByIdSchema"), "params"))
    .all(setFilter({"_id": "params._id"}))
    .get(verifyRoles(standardMethodRoles["GET"]), positionsController.getOne)
    .put(verifyRoles(standardMethodRoles["PUT"]), bodyDbSchemaValidator(Position), positionsController.updateElement)
    .delete(verifyRoles(standardMethodRoles["DELETE"]), positionsController.deleteElement)
    .all(unsupportedMethodHandler);

module.exports = router;