const jwt = require('jsonwebtoken');

module.exports =async function generateTokenPair(payload) {
    const ACCESS_SECRET = process.env.ACCESS_SECRET;
    const REFRESH_SECRET = process.env.REFRESH_SECRET;

    const accessToken = jwt.sign(payload, ACCESS_SECRET, { expiresIn: '15m' });
    const refreshToken = jwt.sign(payload, REFRESH_SECRET, { expiresIn: '15d' });

    return { accessToken, refreshToken };

};