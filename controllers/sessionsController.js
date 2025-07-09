const User = require("../database/models/user");
const {compare} = require("bcrypt");
const generateTokenPair = require("./methods/generateTokenPair");
const setCookie = require("./methods/setCookie");
const Token = require("../database/models/token");

class UserController {
    async loginUser(req, res) {
        const { email, password } = req.body;

        try {
            const user = await User.findByPk(email);

            if (!user) {
                return res.status(401).json({ error: 'User not found' });
            }

            const isMatch = await compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ error: 'Incorrect password or email' });
            }
                //destroys previous tokens and generates a new pair
            const { accessToken, refreshToken } = await generateTokenPair({ email });
            const prevToken=await Token.findOne({where: {user_email: email}})
            await Promise.all([
                Token.destroy(prevToken),
                Token.create({ user_email: email, token: refreshToken }),
                setCookie(res, 'refreshToken', refreshToken)
            ]);
            return res.sendSuccess({key:"token", value:accessToken});
        } catch (e) {
            return res.status(500).json({ error: 'Internal error ' +e.message });
        }
    }
}

module.exports = new UserController()