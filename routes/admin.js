const express = require('express');
const router = express.Router();
const bodyDbSchemaValidator = require("../middleware/validationHandlers/bodyDbSchemaValidator");
const Controller = require('../controllers/dbModelController');
const User = require("../model/User");
const UserController = new Controller(User);
const unsupportedMethodHandler = require('../middleware/ErrorHandlers/unsupportedMethodHandler');
const verifyRoles = require("../middleware/verifyRoles");

router.route("/register")
    .post(verifyRoles("admin"), bodyDbSchemaValidator(User), require("../middleware/hashPassword"), UserController.addElement)
    .all(unsupportedMethodHandler);

module.exports = router;