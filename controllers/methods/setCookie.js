module.exports = function setCookie(res, cookieName, cookieValue) {
    res.cookie(cookieName, cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 24 * 60 * 60 * 1000
    });
}