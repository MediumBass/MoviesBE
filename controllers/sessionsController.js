const User = require('../database/models/user');
const {compare} = require('bcrypt');
const generateTokenPair = require('./methods/generateTokenPair');
const setCookie = require('./methods/setCookie');
const Token = require('../database/models/token');
const sendError = require('./methods/errorWrapper');

class UserController {
    async loginUser(req, res) {
        const { email, password } = req.body;
        const user = await User.findByPk(email);
        if (!user) {
            throw new sendError('No user found: ' , 404, email);
        }
        const isMatch = await compare(password, user.password);
        if (!isMatch) {
            throw new sendError('Incorrect password or email' , 401, email);
        }
        //destroys previous tokens and generates a new pair
        try{
            const { accessToken, refreshToken } = await generateTokenPair({ email });
            const prevToken=await Token.findOne({where: {user_email: email}});
            await Promise.all([
                Token.destroy(prevToken),
                Token.create({ user_email: email, token: refreshToken }),
                setCookie(res, 'refreshToken', refreshToken)
            ]);
            return res.sendSuccess({key:'token', value:accessToken});
        }catch (e) {
            throw new sendError('Failed to generate new tokens: ' + e.errors[0].message , 409 , e.errors[0].value );
        }

    }
}

module.exports = new UserController();