const express = require('express');
const router = express.Router();
const ajvSchemaValidator = require("../../middleware/validationHandlers/ajvSchemaValidator")
const bodyDbSchemaValidator = require("../../middleware/validationHandlers/bodyDbSchemaValidator");
const unsupportedMethodHandler = require('../../middleware/ErrorHandlers/unsupportedMethodHandler');
const Technique = require("../../model/Technique");
const Controller = require("../../controllers/dbModelController");
const techniquesController = new Controller(Technique);
const setFilter = require("../../middleware/SettingFiltersHandlers/setFilterFromRequest")
const verifyRoles = require("../../middleware/verifyRoles");

/**
 * @openapi
{
    "paths": {
        "/technique/": {
            "get": {
                "security": [{
                    "bearerAuth": []
                }],
                "tags": [
                    "technique"
                ],
                "summary": "Retrieves all techniques",
                "description": "Returns all techniques present in the database",
                "operationId": "getAllTechniques",
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Technique"
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
                        "description": "No technique data found"
                    }
                }
            },
            "post": {
                "security": [{
                    "bearerAuth": []
                }],
                "tags": [
                    "technique"
                ],
                "summary": "Add a new technique",
                "description": "Add a new technique to the database by providing a request body that matches the technique schema",
                "operationId": "addNewTechnique",
                "requestBody": {
                    "description": "Conforms to the Technique schema",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Technique"
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
                                    "$ref": "#/components/schemas/Technique"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Request body violates technique schema (does not include unique constraints)"
                    },
                    "401": {
                        "description": "Invalid authorization header, JWT token, or role"
                    },
                    "403": {
                        "description": "Insufficient permissions to complete action"
                    },
                    "409": {
                        "description": "ObjectId or name of technique already exist in database"
                    }
                }
            }
        }
    }
}
 */
router.route('/')
    .get(verifyRoles("user"), techniquesController.getAll)
    .post(verifyRoles("editor"), bodyDbSchemaValidator(Technique), techniquesController.addElement)
    .all(unsupportedMethodHandler);

/**
 * @openapi
{
    "paths": {
        "/technique/{_id}": {
            "get": {
                "security": [{
                    "bearerAuth": []
                }],
                "tags": [
                    "technique"
                ],
                "summary": "Find technique by _id",
                "description": "Returns a single technique",
                "operationId": "getTechniqueById",
                "parameters": [
                    {
                        "name": "_id",
                        "in": "path",
                        "description": "mongodb objectId of technique",
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
                                    "$ref": "#/components/schemas/Technique"
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
                        "description": "No technique data found"
                    }
                }
            },
            "put": {
                "security": [{
                    "bearerAuth": []
                }],
                "tags": [
                    "technique"
                ],
                "summary": "Update technique by _id",
                "description": "Updates a single technique in the database",
                "operationId": "updateTechniqueById",
                "requestBody": {
                    "description": "Conforms to the Technique schema",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Technique"
                            }
                        }
                    },
                    "required": true
                },
                "parameters": [
                    {
                        "name": "_id",
                        "in": "path",
                        "description": "mongodb objectId of technique",
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
                        "description": "_id parameter is malformed or request body violates technique schema (does not include unique constraints)"
                    },
                    "401": {
                        "description": "Invalid authorization header, JWT token, or role"
                    },
                    "403": {
                        "description": "Insufficient permissions to complete action"
                    },
                    "404": {
                        "description": "No technique data found"
                    }
                }
            },
            "delete": {
                "security": [{
                    "bearerAuth": []
                }],
                "tags": [
                    "technique"
                ],
                "summary": "Delete a technique by _id",
                "description": "Deletes a single technique from the database",
                "operationId": "deleteTechniqueById",
                "parameters": [
                    {
                        "name": "_id",
                        "in": "path",
                        "description": "mongodb objectId of technique",
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
                        "description": "ObjectId does not exist in the techniques collection"
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
    .get(verifyRoles("user"), techniquesController.getOne)
    .put(verifyRoles("editor"), bodyDbSchemaValidator(Technique), techniquesController.updateElement)
    .delete(verifyRoles("editor"), techniquesController.deleteElement)
    .all(unsupportedMethodHandler);
 
/**
 * @openapi
{
    "paths": {
        "/technique/position/{_id}": {
            "get": {
                "security": [{
                    "bearerAuth": []
                }],
                "tags": [
                    "technique"
                ],
                "summary": "Retrieves all techniques with the position _id provided",
                "description": "Returns all techniques present in the database with the position _id provided in the positions array",
                "operationId": "getAllTechniquesFromPosition",
                "parameters": [
                    {
                        "name": "_id",
                        "in": "path",
                        "description": "mongodb objectId of position",
                        "required": "true",
                        "schema": {
                            "type": "string",
                            "example": "668e2cf355aa210e8a5a4251"
                        }
                    }
                ],
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Technique"
                                    }
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
                        "description": "No technique data found with the provided position _id"
                    }
                }
            }
        }
    }
}
 */
router.route('/position/:_id')
    .all(ajvSchemaValidator(require("../../libs/Schemas/requestByIdSchema"), "params"))
    .all(setFilter({"positions.position": "params._id"}))
    .get(verifyRoles("user"), techniquesController.getAll)
    .all(unsupportedMethodHandler);

module.exports = router;