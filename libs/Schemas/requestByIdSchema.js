const Ajv = require("ajv")
const ajv = new Ajv({allErrors: true, $data: true})
const mongoose = require("mongoose");

ajv.addKeyword({
  keyword: "validate",
  $data: true,
  validate: function(data) {return mongoose.isValidObjectId(data)},
  error: {message: (cxt) =>{; return cxt.schema.name + " must be a valid mongodb ObjectId" }}
})

const schema = {
    type: "object",
    properties: {
      "_id": {
        type: "string",
        validate: {$data: "/_id", name: "_id"}
      }
     },
     required: ["_id"]
}

module.exports = ajv.compile(schema);