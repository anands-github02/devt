    const express = require('express');
    const bcrypt = require('bcrypt');
    const jwt = require('jsonwebtoken');
    const {validateSignUpApi} = require('../utils/validation')
    const {User} = require('../models/user')



    const authRouter = express.Router();

    authRouter.post('/login', async(req,res)=>{
        try{
            const {email, password} = req.body;
            const user = await User.findOne({email:email});
            if(!user){
                throw new Error('Invalid Credentials')
            }
        const isPasswordValid = await user.validateToken(password)
        if(isPasswordValid){

            const token = await user.getJwt();

            res.cookie('token',token, {expires: new Date(Date.now()+ 1*3600000)}, {httpOnly:true})
            res.send('Login Successful');
        }else{
            throw new Error('Invalid Credentials')
        }
        }catch(e){
            res.status(400).send('Error: ' + e.message)
        }
    })

    authRouter.post('/signup',async (req,res)=>{
        // const userObj = {
        //     firstName:'Anand',
        //     lastName:'MG',
        //     age:25,
        //     email:'anand@gmail.com'
        // }
        // console.log(req.body)
        try{
            validateSignUpApi(req.body)

            const {firstName, lastName, email, password} = req.body
            const passwordHash =await  bcrypt.hash(password, 10)
            console.log(passwordHash)
            const user =new User({
                firstName,
                lastName,
                email,
                password: passwordHash
            });

            //API Validation
            if(user.skills.length>10){
                throw new Error('Cannot have more than 10 skills')
            }
            await user.save();
            res.send('User Added Successfully')
        }catch(e){
            res.status(400).send('Error: ' + e.message)
        }
        
    })

    authRouter.post('/logout', async(req,res) =>{
        res.cookie('token', null, {expires: new Date(Date.now())}).send('Logged Out Successfully')
    })

    module.exports = authRouter