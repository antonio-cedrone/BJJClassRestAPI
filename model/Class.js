const mongoose = require("mongoose");
const { format, isMatch } = require('date-fns');

/**
 * @openapi
{
    "components": {
        "schemas": {
            "Class": {
                "type": "object",
                "properties": {
                    "school": {
                        "type": "string",
                        "required": "true",
                        "example": "Northern Karate Maple"
                    },
                    "notes": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "properties": {
                                "body": {
                                    "type": "string",
                                    "required": "true"
                                }
                            }
                        }
                    },
                    "techniques": {
                        "type": "array",
                        "items": {
                            "type": "string",
                            "$ref": "#/components/schemas/Technique",
                            "required": "true"
                        },
                        "minimum": "1",
                        "required": "true"
                    },
                    "date": {
                        "type": "string",
                        "required": "true",
                        "example": "Jan 01, 11:09:08am"
                    }
                }
            }
        }
    }
}
 */
const classSchema = new mongoose.Schema(
    { 
        school: {type: String, required: true},
        notes: [{ body: {type: String, required: true} }],
        techniques: {
            type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Technique', required: true }],
            validate: [(arr) => {return arr.length >= 1}, 'at least one position reference is required'],
            required: true
        },
        date: {type: String, default: format(new Date(), 'MMM dd, yyyy hh:mmaaa'), required: true, unique: true, validate: {
            validator: (value) => { isMatch(value, 'MMM dd, yyyy hh:mmaaa'); }, 
            message: props => `${props.value} is not a valid date`}} 
    }, { strict: "throw" });

module.exports = mongoose.model('Class', classSchema);