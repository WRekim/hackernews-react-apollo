const jwt = require('jsonwebtoken');
const APP_SECRET = 't3a-with-Biscuits';

function getTokenPayload(token) {
    return jwt.verify(token, APP_SECRET);
}

//A helper function that you can call in resolvers that require authentication e.g. postLink
function getUserId(req, authToken) {
    if (req) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            if (!token) {
                throw new Error('No token found');
            }
            const { userId } = getTokenPayload(token);
            return userId;
        }
    } else if (authToken) {
        const { userId } = getTokenPayload(authToken);
        return userId;
    }

    throw new Error('Not authenticated');
}

module.exports = {
    APP_SECRET,
    getUserId
};