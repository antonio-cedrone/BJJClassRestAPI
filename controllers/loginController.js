const User = require('../model/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

/*
    Credit to Dave Grey for this authorization code located in this Github Resource:
    https://github.com/gitdagray/mongo_async_crud

    This middleware handles login by comparing the provided password with the found user's as well as handling
    the creation and saving of the refresh token in the database and a cookie.
*/

const handleLogin = async (req, res, next) => {
    try {
        const foundUser = req.intermediateBody;

        // Evaluate the password.
        const match = await bcrypt.compare(req.body.password, foundUser.password);
        if (!match) {
            const error = new Error("Incorrect Password");
            error.status = 401;
            throw error;
        } 

        const role = foundUser.role;
        // Create the JWTs.
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "role": role
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '30s' }
        );
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        // Save refreshToken with current user.
        foundUser.refreshToken = refreshToken;
        const result = await foundUser.save();

        // Confirm that the user was saved successfully.
        if (result !== foundUser) {
            throw new Error("Failed to save user with token");
        }

        // Create Secure Cookie with refresh token.
        res.cookie('jwt', refreshToken, { httpOnly: true, secure: true, sameSite: 'Strict', maxAge: 24 * 60 * 60 * 1000 });

        // Status already set to 200 on successful database find query in earlier middleware so it is not done here.
        req.intermediateBody = { role, accessToken };
        next();
    }
    catch (err) {
        next(err);
    }
}

module.exports = handleLogin;