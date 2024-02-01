const jwt = require('jsonwebtoken');
require('dotenv').config();
const requireAuth = (req,res,next) =>{
     const token = req.header('Authorization');
     if(!token){
        return res.status(401).json({message:'Unautorized'});
     }
     try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET_KEY);
        req.body.user = decoded.user;
        next();
     }catch(error){
        console.log(error);
        return res.status(401).json({message:'Unauthorized'})
     }
}

module.exports = requireAuth;