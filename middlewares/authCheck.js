const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
   try{
    const token = req.headers.authorization;
    if(!token){
        return res.status(403).json({errors: {msg: 'Authorization error: no auth token provided'}});
    }
     jwt.verify(token, process.env.ACCESS_SECRET);
   }catch (e){
       return res.status(403).json({errors: {msg:'Authorization error: '+e.message}});
   }
    next();
};