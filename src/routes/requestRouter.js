const express = require('express');
const { userAuth } = require('../middlewares/auth');
const { ConnectionRequest } = require('../models/connectionRequest');
const { User } = require('../models/user');

const requestRouter = express.Router();


requestRouter.post('/request/send/:status/:toUserId', userAuth, async (req, res) => {
    try {
        const fromUserId = req.user._id;
        const{toUserId, status} = req.params;
        const isValidUser = await User.findById(toUserId);
        console.log(isValidUser)
        if (!isValidUser) {
            throw new Error('User Does not exist')
        }
        const isValidRequest = await ConnectionRequest.findOne({
            $or: [
                { fromUserId, toUserId },
                { fromUserId: toUserId, toUserId: fromUserId }
            ]
        });
        console.log(isValidRequest)
        if(isValidRequest){
            throw new Error('Request Already exists');
        }
        const allowedStatuses = ['interested', 'ignored'];
        if(!allowedStatuses.includes(status)){
            throw new Error('Invalid Status');
        }
        // if(toUserId==req.user._id){
        //     throw new Error('Cannot send request to yourself');

        // }
        const connectionRequest = new ConnectionRequest({
            fromUserId: req.user._id,
            toUserId: req.params.toUserId,
            status: req.params.status
        })
        const data = await connectionRequest.save();
        res.json({
            message: 'Connection Sent',
            data
        });

    } catch (e) {
        res.status(400).send('Error: ' + e.message)
    }
})

requestRouter.post('/request/review/:status/:requestId', userAuth, async(req,res)=>{
    try{
        const loggedInUser = req.user;
        const {status, requestId}= req.params;

        const allowedStatus = ['accepted', 'ignored'];
        if(!allowedStatus.includes(status)){
           return  res.status(400).json({message:'Invalid status code'})
        }
        const connectionReq = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId:loggedInUser._id,
            status:'interested'
        })
        if(!connectionReq){
            return  res.status(400).json({message:'Request not found'})
        }
        connectionReq.status=status;
        const data= await connectionReq.save();
        res.json({message:'Connection request '+ status , data})
    }catch(e){
        res.status(400).send('Error: ' + e.message)
    }
})


module.exports = requestRouter;