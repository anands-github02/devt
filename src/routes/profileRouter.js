const express = require('express');
const { userAuth } = require('../middlewares/auth');
const {User} = require('../models/user')
const {validateUpdateUserApi, validateUpdatePasswordApi} = require('../utils/validation')
const bcrypt = require('bcrypt');


const profileRouter = express.Router();

profileRouter.get('/profile', userAuth, async(req,res)=>{
    try{
    res.send(req.user);
    }catch(e){
        res.status(400).send('Error: ' + e.message)
    }
});
profileRouter.get('/getAllUsers', userAuth, async(req,res)=>{
    try{
        const users = await User.find({})
    res.send(users);
    }catch(e){
        res.status(400).send('Error: ' + e.message)
    }
});

// app.delete('/user', async(req,res)=>{
//     const id = req.query.id
//     try{
//         const user=await User.findByIdAndDelete(id);
//         res.send('Deleted')
//     }
//     catch(e){
//         res.status(400).send('Something went wrong')
//     }
// })

// //Update user

profileRouter.patch('/profile/edit', userAuth, async (req,res)=>{
    try{
    const loggedInUser = req.user;

    validateUpdateUserApi(req.body)
    Object.keys(req.body).forEach(key=>loggedInUser[key]=req.body[key])

    await loggedInUser.save();
    
        res.json({massage:'User updated Successfully', data:loggedInUser});
    }catch(e){
        res.status(400).send('Error ' + e.message)

    }
})
profileRouter.patch('/profile/editPassword', userAuth, async (req,res)=>{
    try{
    const loggedInUser = req.user;
    const {newPassword} = req.body;
    const isAllowed = validateUpdatePasswordApi(newPassword)
    // bcrypt.compare(loggedInUser.password)
    if(!isAllowed){
        throw new Error('Please enter new password')
    }
    const passwordHash =await  bcrypt.hash(newPassword, 10)
    loggedInUser.password = passwordHash;

    await loggedInUser.save();
    
        res.json({massage:'Password updated Successfully', data:loggedInUser});
    }catch(e){
        res.status(400).send('Error ' + e.message)

    }
})

module.exports = profileRouter;