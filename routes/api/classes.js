const express = require('express');
const router = express.Router();
const ajvSchemaValidator = require("../../middleware/validationHandlers/ajvSchemaValidator")
const bodyDbSchemaValidator = require("../../middleware/validationHandlers/bodyDbSchemaValidator");
const unsupportedMethodHandler = require('../../middleware/ErrorHandlers/unsupportedMethodHandler');
const Class = require("../../model/Class");
const Controller = require("../../controllers/dbModelController");
const classesController = new Controller(Class);
const setFilter = require("../../middleware/SettingFiltersHandlers/setFilterFromRequest")
const verifyRoles = require("../../middleware/verifyRoles");
const standardMethodRoles = require("../../config/standardMinRoles");

/**
 * @openapi
{
    "paths": {
        "/class/": {
            "get": {
                "security": [{
                    "bearerAuth": []
                }],
                "tags": [
                    "class"
                ],
                "summary": "Retrieves all classes",
                "description": "Returns all classes present in the database",
                "operationId": "getAllClasses",
                "responses": {
                    "200": {
                        "description": "successful operation",
                        "content": {
                            "application/json": {
                                "schema": {
                                    "type": "array",
                                    "items": {
                                        "$ref": "#/components/schemas/Class"
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
                        "description": "No class data found"
                    }
                }
            },
            "post": {
                "security": [{
                    "bearerAuth": []
                }],
                "tags": [
                    "class"
                ],
                "summary": "Add a new class",
                "description": "Add a new class to the database by providing a request body that matches the class schema",
                "operationId": "addNewClass",
                "requestBody": {
                    "description": "Conforms to the Class schema",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Class"
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
                                    "$ref": "#/components/schemas/Class"
                                }
                            }
                        }
                    },
                    "400": {
                        "description": "Request body violates class schema (does not include unique constraints)"
                    },
                    "401": {
                        "description": "Invalid authorization header, JWT token, or role"
                    },
                    "403": {
                        "description": "Insufficient permissions to complete action"
                    },
                    "409": {
                        "description": "ObjectId or name of class already exist in database"
                    }
                }
            }
        }
    }
}
 */
router.route('/')
    .get(verifyRoles(standardMethodRoles["GET"]), classesController.getAll)
    .post(verifyRoles(standardMethodRoles["POST"]), bodyDbSchemaValidator(Class), classesController.addElement)
    .all(unsupportedMethodHandler);

/**
 * @openapi
{
    "paths": {
        "/class/{_id}": {
            "get": {
                "security": [{
                    "bearerAuth": []
                }],
                "tags": [
                    "class"
                ],
                "summary": "Find class by _id",
                "description": "Returns a single class",
                "operationId": "getClassById",
                "parameters": [
                    {
                        "name": "_id",
                        "in": "path",
                        "description": "mongodb objectId of class",
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
                                    "$ref": "#/components/schemas/Class"
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
                        "description": "No class data found"
                    }
                }
            },
            "put": {
                "security": [{
                    "bearerAuth": []
                }],
                "tags": [
                    "class"
                ],
                "summary": "Update class by _id",
                "description": "Updates a single class in the database",
                "operationId": "updateClassById",
                "requestBody": {
                    "description": "Conforms to the Class schema",
                    "content": {
                        "application/json": {
                            "schema": {
                                "$ref": "#/components/schemas/Class"
                            }
                        }
                    },
                    "required": true
                },
                "parameters": [
                    {
                        "name": "_id",
                        "in": "path",
                        "description": "mongodb objectId of class",
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
                        "description": "_id parameter is malformed or request body violates class schema (does not include unique constraints)"
                    },
                    "401": {
                        "description": "Invalid authorization header, JWT token, or role"
                    },
                    "403": {
                        "description": "Insufficient permissions to complete action"
                    },
                    "404": {
                        "description": "No class data found"
                    }
                }
            },
            "delete": {
                "security": [{
                    "bearerAuth": []
                }],
                "tags": [
                    "class"
                ],
                "summary": "Deletes a class by _id",
                "description": "Delete a single class from the database",
                "operationId": "deleteClassById",
                "parameters": [
                    {
                        "name": "_id",
                        "in": "path",
                        "description": "mongodb objectId of class",
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
                        "description": "ObjectId does not exist in the classes collection"
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
    .get(verifyRoles(standardMethodRoles["GET"]), classesController.getOne)
    .put(verifyRoles(standardMethodRoles["PUT"]), bodyDbSchemaValidator(Class), classesController.updateElement)
    .delete(verifyRoles(standardMethodRoles["DELETE"]), classesController.deleteElement)
    .all(unsupportedMethodHandler);

/**
 * @openapi
{
    "paths": {
        "/class/school/{school}": {
            "get": {
                "security": [{
                    "bearerAuth": []
                }],
                "tags": [
                    "class"
                ],
                "summary": "Retrieves all classes that took place at the provided school",
                "description": "Returns all classes in the database that took place at the school provided",
                "operationId": "getAllClassesAtSchool",
                "parameters": [
                    {
                        "name": "school",
                        "in": "path",
                        "description": "name of jiu jitsu school",
                        "required": "true",
                        "schema": {
                            "type": "string",
                            "example": "Northern Karate Maple"
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
                                        "$ref": "#/components/schemas/Class"
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
                        "description": "No class data found for the provided school"
                    }
                }
            }
        }
    }
}
 */
router.route('/school/:school')
    .all(setFilter({"school": "params.school"}))
    .get(verifyRoles(standardMethodRoles["GET"]), classesController.getAll)
    .all(unsupportedMethodHandler);

module.exports = router;