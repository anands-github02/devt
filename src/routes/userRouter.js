const express = require('express');
const { userAuth } = require('../middlewares/auth');
const User = require('../models/user');
const { ConnectionRequest } = require('../models/connectionRequest');


const userRouter = express.Router();

userRouter.get('/profile', userAuth, async(req,res)=>{
    try{
    res.send(req.user);
    }catch(e){
        res.status(400).send('Error: ' + e.message)
    }
});

userRouter.get('/user/requests/received', userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequests= await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:'interested'
        }).populate('fromUserId', ['firstName', 'lastName', 'profileUrl', 'gender'])
        res.json({
            message:'data fetched successfully',
            data: connectionRequests
        })
    }
    catch(e){
        res.status(400).send('Error: ' + e.message)
    }
})
userRouter.get('/user/connections', userAuth, async(req, res)=>{
    try{
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            $or: [
                { toUserId: loggedInUser._id },
                { fromUserId: loggedInUser._id }
            ],
            status: 'accepted'
        }).populate('fromUserId', ['firstName', 'lastName', 'profileUrl', 'gender'])
        res.json({
            message:'data fetched successfully',
            data: connectionRequests
        })
    }
    catch(e){
        res.status(400).send('Error: ' + e.message)
    }
})


module.exports = userRouter;