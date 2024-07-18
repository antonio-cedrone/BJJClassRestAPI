const Ajv = require("ajv").default
const ajv = new Ajv()
require("ajv-keywords")(ajv)

const schema = {
    type: "object",
    properties: {
      "content-type": {
        enum: ["application/json"],
        transform: ["toLowerCase"]
      }
     }
}

module.exports = ajv.compile(schema);