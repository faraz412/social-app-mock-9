const express=require("express");
const { UserModel } = require("../models/user.model");
const { authenticate } = require("../middlewares/authenticate.mw.js");

const userRouter=express.Router();

userRouter.get("/",async(req,res)=>{
    try{
        const users=await UserModel.find();
        res.send(users);
    }catch(err){
        res.status(200).send({"err":"Error in fetching users data"});
    }
});

userRouter.get("/:id/friends",async(req,res)=>{
    const ID=req.params.id;
    try{
        const user=await UserModel.findById(ID);
        res.send(user.friends);
    }catch(err){
        res.send({"err":"Error in fetching friends data"});
    }
});

userRouter.post("/:id/friends",authenticate, async(req,res)=>{
    const userID_sending_req=req.body.userID;
    const userID_receiving_req=req.params.id;
    try{
        const user=await UserModel.findById(userID_receiving_req);
        user.friendRequests.push({userID:userID_sending_req});
        res.status(201).send({"msg":"Friend request sent","to_user":user});
    }catch(err){
        res.send({"err":"Error in sending friend request"});
    }
});

userRouter.patch("/:id/friends/:friendId",authenticate,async(req,res)=>{
    const userID_logged_in=req.body.userID;
    const userID=req.params.id;
    const friendID=req.params.friendId;
    try{
        if(userID_logged_in==userID){
            const user=await UserModel.findById(userID);
            const friends=[...user.friends];
            const friendRequests=[...user.friendRequests];
            const filtered_friend_requests=friendRequests.filter((elem)=>{
                return elem.userID!=friendID;
            });
            friends.push({userID:friendID});
            await UserModel.findByIdAndUpdate(userID,{friends,friendRequests:filtered_friend_requests});
            res.send({"msg":"Friend request accepted"});
        }else{
            res.send({"msg":"Not authorized"});
        }
    }catch(err){
        res.send({"err":"Error in accepting friend request"});
    }
})

module.exports={userRouter};