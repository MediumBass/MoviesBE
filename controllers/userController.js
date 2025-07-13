const bcrypt = require('bcrypt');
const User = require('../database/models/user');
const Token = require('../database/models/token');
const generateTokenPair = require('./methods/generateTokenPair');
const setCookie = require('./methods/setCookie');
const sendError = require('./methods/errorWrapper');

const saltRounds =  parseInt(process.env.SALT_ROUNDS,10);


class UserController {

    async createUser(req, res) {
        const { email, name, password, confirmPassword } = req.body;
            if (password !== confirmPassword)  {throw new sendError('Password do not match', 400, email);}
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, salt);
            await User.create({ email,name, password: hash });
        } catch (e) {
            throw new sendError('Error creating new user: ' + e.errors[0].message, 409, e.errors[0].value);

        }
        const { accessToken, refreshToken } = await generateTokenPair({ email });
        try{
        await Promise.all([
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