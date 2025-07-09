const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
   try{
    const token = req.headers.authorization;
    if(!token){
        return res.status(403).json({error: 'Authorization error: no auth token provided'})
    }
     jwt.verify(token, process.env.ACCESS_SECRET);
   }catch (e){
       return res.status(403).json('Authorization error: '+e.message)
   }
    next();
};