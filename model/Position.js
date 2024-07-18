const mongoose = require('mongoose');
const {format, isMatch} = require('date-fns');

/**
 * @openapi
{
    "components": {
        "schemas": {
            "Position": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string",
                        "required": "true",
                        "unique": "true",
                        "example": "side control"
                    },
                    "imageLink": {
                        "type": "string",
                        "example": "https://upload.wikimedia.org/wikipedia/commons/0/05/Royce_Gracie_Demonstration_09.jpg"
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
                                    "format": "MMM dd, yyyy hh:mmaaa",
                                    "example": "Jan 01, 2024 05:10pm"
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
 */
const positionSchema = new mongoose.Schema({ 
    name: {type: String, required: [true, "must have a position name"], unique: true},
    imageLink: String,
    notes: [{ 
        body: {type: String, required: [true, "all notes need a body"]}, 
        date: {type: String, default: format(new Date(), 'MMM dd, yyyy hh:mmaaa'), validate: {
            validator: (value) => { isMatch(value, 'MMM dd, yyyy hh:mmaaa'); }, 
            message: props => `${props.value} is not a valid date conforming to format: MMM dd, yyyy hh:mmaaa`}} 
    }]
}, { strict: "throw" });

module.exports = mongoose.model('Position', positionSchema);