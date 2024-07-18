const mongoose = require("mongoose");
const { format } = require('date-fns');

/**
 * @openapi
{
    "components": {
        "schemas": {
            "Technique": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "required": "true",
                        "unique": "true",
                        "example": "bread cutter choke"
                    },
                    "notes": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "body": {
                                    "type": "string",
                                    "required": "true"
                                },
                                "date": {
                                    "type": "string",
                                    "example": "Jan 01, 11:09:08am"
                                }
                            }
                        }
                    },
                    "positions": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "position": {
                                    "$ref": "#/components/schemas/Position"
                                },
                                "videoLink": {
                                    "type": "string"
                                }
                            }
                        },
                        "minimum": "1",
                        "required": "true"
                    }
                }
            }
        }
    }
}
 */
const techniqueSchema = new mongoose.Schema(
    { 
        name: {type: String, required: true, unique: true},
        notes: [{ 
            body: {type: String, required: true}, 
            date: {type: String, default: format(new Date(), 'MMM dd, yyyy h:mmaaa'), validate: {
                validator: (value) => { isMatch(value, 'MMM dd, yyyy hh:mmaaa'); }, 
                message: props => `${props.value} is not a valid date`}} 
        }],
        positions: {
            type: [{ position: {type: mongoose.Schema.Types.ObjectId, ref: 'Position', required: true}, videoLink: String }],
            validate: [(arr) => {return arr.length >= 1}, 'at least one position reference is required'],
            required: true
        }
    }, { strict: "throw" });

module.exports = mongoose.model('Technique', techniqueSchema);