const bcrypt = require("bcrypt");

const hashPassword = async (req, res, next) => {
    try {
        // Encrypt the password.
        req.body.password = await bcrypt.hash(req.body.password, 10);
        next();
    } catch (err) {
        next(err);
    }
}

module.exports = hashPassword;