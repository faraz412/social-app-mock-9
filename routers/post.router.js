const express=require("express");
const { UserModel } = require("../models/user.model");
const { PostModel } = require("../models/post.model");
const { authenticate } = require("../middlewares/authenticate.mw.js");

const postRouter=express.Router();

postRouter.get("/",async(req,res)=>{
    try{
        const posts=await PostModel.find();
        res.status(200).send(posts);
    }catch(err){
        res.send({"err":"Error in fetching all posts"});
    }
});

postRouter.post("/", authenticate, async(req,res)=>{
    const {text,image} =req.body;
    const userID_logged_in=req.body.userID;
    try{
        const post=new PostModel({
            user: userID_logged_in,
            text,
            image
        });
        await post.save();
        const user=await UserModel.findById(userID_logged_in);
        const userPosts=[...user.posts];
        userPosts.push(post._id);
        await UserModel.findByIdAndUpdate(userID_logged_in,{posts:userPosts});
        res.status(201).send({"msg":"New Post added in PostModel and UserModel"});
    }catch(err){
        res.send({"err":"Error in adding new post"});
    }
});

postRouter.patch("/:id", authenticate, async(req,res)=>{
    const {text,image} =req.body;
    const userID_logged_in=req.body.userID;
    try{
        const post=await PostModel.findById(req.params.id);
        const userID_in_post=post.user;
        if(userID_in_post==userID_logged_in){
            await PostModel.findByIdAndUpdate(req.params.id,{text,image});
            res.send({"msg":"Post updated"});
        }else{
            res.send({"msg":"Not authorized"});
        }
    }catch(err){
        // console.log(err);
        res.send({"err":"Error in updating post"});
    }
});

postRouter.delete("/:id", authenticate, async(req,res)=>{
    const userID_logged_in=req.body.userID;
    try{
        const post=await PostModel.findById(req.params.id);
        const user=await UserModel.findById(userID_logged_in);
        const userID_in_post=post.user;
        if(userID_in_post==userID_logged_in){
            await PostModel.findByIdAndDelete(req.params.id);
            const userPosts=[...user.posts];
            let filteredPosts=userPosts.filter((elem)=>{
                return elem.postID!=req.params.id;
            });
            await UserModel.findByIdAndUpdate(userID_logged_in,{posts:filteredPosts});
            res.send({"msg":"Post deleted"});
        }else{
            res.send({"msg":"Not authorized"});
        }
    }catch(err){
        // console.log(err);
        res.send({"err":"Error in deleting post"});
    }
});

postRouter.post("/:id/like", authenticate, async(req,res)=>{
    const userID_logged_in=req.body.userID;
    const postID=req.params.id;
    try{
        const post=await PostModel.findById(postID);
        const postLikes=[...post.likes];
        postLikes.push({userID:userID_logged_in});
        await PostModel.findByIdAndUpdate(postID,{likes:postLikes});
        res.send({"msg":"Likes updated"});
    }catch(err){
        // console.log(err);
        res.send({"err":"Error in liking post"});
    }
});

postRouter.post("/:id/comment", authenticate, async(req,res)=>{
    const {text}=req.body;
    const userID_logged_in=req.body.userID;
    const postID=req.params.id;
    try{
        const post=await PostModel.findById(postID);
        const postComments=[...post.comments];
        postComments.push({user:userID_logged_in,text});
        await PostModel.findByIdAndUpdate(postID,{comments:postComments});
        res.send({"msg":"Comment added"});
    }catch(err){
        // console.log(err);
        res.send({"err":"Error in adding comment"});
    }
});

postRouter.get("/:id",async(req,res)=>{
    try{
        const post=await PostModel.findById(req.params.id);
        res.status(200).send(post);
    }catch(err){
        res.send({"err":"Error in fetching post data"});
    }
});


module.exports={postRouter};