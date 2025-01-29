const mongoose = require('mongoose');
const validator = require('validator')

const connectionRequestSchema = new mongoose.Schema(
    {
        fromUserId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            alidate: {
                validator: function(v) {
                  // Check if the value is a valid ObjectId
                  return mongoose.Types.ObjectId.isValid(v);
                },
                message: props => `${props.value} is not a valid ObjectId!`
              },
              ref:'User'
        },
        toUserId:{
            type:mongoose.Schema.Types.ObjectId,
            required:true,
            alidate: {
                validator: function(v) {
                  // Check if the value is a valid ObjectId
                  return mongoose.Types.ObjectId.isValid(v);
                },
                message: props => `${props.value} is not a valid ObjectId!`
              },
              ref:'User'

        },
        status:{
            type:String,
            enum:{
                values:['interested', 'ignored', 'accepted', 'rejected'],
                message:`{VALUE} is not acceptable status`,
                required:true
            }
        }
    },
        {timestamps:true},
)

connectionRequestSchema.index({fromUserId:1, toUserId:1})


connectionRequestSchema.pre('save',function(next){
    const connectionReq= this;
    if(connectionReq.fromUserId.equals(connectionReq.toUserId)){
        throw new Error('Same user ')
    }
    next();
}
)

const ConnectionRequest = new mongoose.model('connectionRequest',connectionRequestSchema);



module.exports={ConnectionRequest};
