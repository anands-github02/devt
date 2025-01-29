
const jwt = require('jsonwebtoken')
const {User} = require('../models/user')

const userAuth = async (req,res,next)=>{
    try{
        const cookies = req.cookies;
        const {token} = cookies;
        
        if(!token){
            throw new Error('Token Invalid');
        }
        const decoded = await jwt.verify(token, 'NamasteDev')
        console.log(decoded);
    
        const user = await User.findById(decoded._id);
        if(!user){
            throw new Error('User does noy exist');
        }
        req.user=user;
        next();
        }catch(e){
            res.status(401).send('Error: ' + e.message)
        }
}

module.exports={
    userAuth
}