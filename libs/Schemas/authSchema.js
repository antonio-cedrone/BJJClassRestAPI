const Ajv = require("ajv")
const ajv = new Ajv({allErrors: true, $data: true})

const schema = {
    type: "object",
    properties: {
      "username": {
        type: "string",
      },
      "password": {
        type: "string",
        maxLength: 40
      }
     },
     required: ["username", "password"],
     additionalProperties: false
}

module.exports = ajv.compile(schema);