const mongoose = require('mongoose');

/*
    Function that connects to the mongoose ClassTechniques database or upon an error exits.
*/

const connect = async () => {
    try {
        await mongoose.connect(process.env.PRIMARY_CONN_STR);
    } catch (err) {
        console.log(err);
        process.exit(1);
    }
}

module.exports = connect;