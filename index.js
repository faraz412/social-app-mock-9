const express=require("express");
require("dotenv").config();
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");

const { connection } = require("./config/db.js");
const { UserModel } = require("./models/user.model.js");
const { userRouter } = require("./routers/user.router.js");
const { postRouter } = require("./routers/post.router.js");

const app=express();
app.use(express.json());

app.get("/", (req,res)=>{
    res.send("Welcome to Social Media App Backend");
});

app.post("/register", async(req,res)=>{
    const {name,email,password,dob,bio}=req.body;
    try{
        const check=await UserModel.find({email});
        if(check.length>0){
            res.send({"msg":"Please Login"});
        }else{
            bcrypt.hash(password,7,async(err,hash)=>{
                if(hash){
                    const user=new UserModel({name,email,password:hash,dob,bio});
                    await user.save();
                    res.status(201).send({"msg":"Succesfully registered"});
                }else{
                    res.send({"msg":"Bcrypt hash error"});
                }
            })
        }
    }catch(err){
        res.send({"err":"Error in registering user"});
    }
});

app.post("/login",async(req,res)=>{
    const {email,password}=req.body;
    try{
        const user=await UserModel.find({email});
        if(user.length>0){
            bcrypt.compare(password,user[0].password,async(err,result)=>{
                if(result){
                    const token=jwt.sign({userID:user[0]._id},process.env.key);
                    res.status(201).send({"msg":"Login Succesfull",token});
                }else{
                    res.send({"msg":"Wrong Credentials"});
                }
            })
        }else{
            res.send({"msg":"Bcrypt compare error"});
        }
    }catch(err){
        res.send({"err":"Login error"});
    }
});

app.use("/users",userRouter);
app.use("/posts",postRouter);

app.listen(process.env.port,async(req,res)=>{
    try{
        await connection;
        console.log("Connected to DB");
    }catch(err){
        console.log("Error connecting to DB");
    }
    console.log(`Listening on port ${process.env.port}`);
});