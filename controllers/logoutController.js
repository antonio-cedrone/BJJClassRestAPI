const User = require('../model/User');

/*
    Credit to Dave Grey for this authorization code located in this Github Resource:
    https://github.com/gitdagray/mongo_async_crud

    This middleware handles logout and while doing so, deletes the cookie if it is present
    and deletes the refreshToken from the database if it is present.
*/

const handleLogout = async (req, res, next) => {
    try {
        const cookies = req.cookies;
        if (cookies?.jwt) {
            const refreshToken = cookies.jwt;

            // Check if refreshToken is in db.
            const foundUser = await User.findOne({ refreshToken }).exec();
            if (foundUser) {
                // Delete refreshToken in db.
                foundUser.refreshToken = '';
                const result = await foundUser.save();
                
                // Confirm that the user was saved successfully.
                if (result !== foundUser) {
                    throw new Error("Failed to save user during logout");
                }
            }
            
            res.clearCookie('jwt', { httpOnly: true, secure: true, sameSite: 'Strict' });
        }

        req.intermediateStatus = 204;
        next();
    }
    catch (err) {
        next(err);
    }
}

module.exports = handleLogout