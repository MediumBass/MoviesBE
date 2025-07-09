const bcrypt = require('bcrypt');
const User = require("../database/models/user");
const Token = require("../database/models/token");
const generateTokenPair = require("./methods/generateTokenPair");
const setCookie = require("./methods/setCookie");

const saltRounds =  parseInt(process.env.SALT_ROUNDS,10)


class UserController {

    async createUser(req, res) {
        const { email,name, password } = req.body;
        try {
            const salt = await bcrypt.genSalt(saltRounds);
            const hash = await bcrypt.hash(password, salt);
            await User.create({ email,name, password: hash });
        } catch (e) {
            console.log(e)
           return res.status(409).json({ error: 'Error creating new user: ' + e.message });
        }
        const { accessToken, refreshToken } = await generateTokenPair({ email });

        await Token.create({ user_email: email, token: refreshToken });
        await setCookie(res, 'refreshToken', refreshToken);
        return res.sendSuccess({key:"token", value:accessToken});
    }
}

module.exports = new UserController()