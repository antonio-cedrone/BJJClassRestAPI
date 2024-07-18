const User = require('../model/User');
const jwt = require('jsonwebtoken');

/*
    Credit to Dave Grey for this authorization code located in this Github Resource:
    https://github.com/gitdagray/mongo_async_crud

    This middleware produces a new accessToken if the provided refreshToken is in the database
    and is valid.
*/

const handleRefreshToken = async (req, res, next) => {
    try {
        // Confirm that there is a refresh token present in the request.
        const cookies = req.cookies;
        if (!cookies?.jwt) {
            const error = new Error("Refresh token is missing");
            error.status = 401;
            throw error;
        }
        
        // Decode the jwt token (in swagger it is present with URI encoding in the curl command).
        const refreshToken = decodeURI(cookies.jwt);

        // Find a user with the refresh token in the database.
        const foundUser = await User.findOne({ refreshToken }).exec();

        if (!foundUser) {
            const error = new Error("Refresh token cannot be matched to user");
            error.status = 403;
            throw error;
        }
        
        // Evaluate the jwt token.
        jwt.verify(
            refreshToken,
            process.env.REFRESH_TOKEN_SECRET,
            (err, decoded) => {
                if (err || foundUser.username !== decoded.username) {
                    const error = new Error("Refresh token format error");
                    error.status = 401;
                    throw error;
                }

                const role = foundUser.role;
                const accessToken = jwt.sign(
                    {
                        "UserInfo": {
                            "username": decoded.username,
                            "role": role
                        }
                    },
                    process.env.ACCESS_TOKEN_SECRET,
                    { expiresIn: '30s' }
                );
                
                // Add accessToken to the request so it can later be sent in the response.
                req.intermediateBody = { role, accessToken };
                req.intermediateStatus = 200;
                next();
            }
        );
    }
    catch (err) {
        next(err);
    }
}

module.exports = handleRefreshToken;