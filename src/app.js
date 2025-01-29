const express = require('express');
const app=express();
require('./config/database')
const {connectDB} = require('./config/database');
const cookieParser = require('cookie-parser');

//Middleware function to convert Json to javascript object.
app.use(express.json());

//Parsing cookies
app.use(cookieParser());

const authRouter = require('./routes/authRouter')
const profileRouter = require('./routes/profileRouter')
const requestRouter = require('./routes/requestRouter')
const userRouter = require('./routes/userRouter')

app.use('/', authRouter);
app.use('/', profileRouter);
app.use('/', requestRouter);
app.use('/', userRouter);





connectDB().then(()=>{
    console.log('connected to db')
}).then(()=>{
    app.listen(3002, ()=>{
        console.log('server successfully running...')
    }) 
}).catch(e=>console.log(e))

