const mongoose=require("mongoose");

const postSchema=mongoose.Schema({
  user: { type: String, required:true },
  text: { type: String, required:true },
  image: { type: String},
  likes: [{ userID:{type: String, required:true}}],
  createdAt: {type:Date, default:Date.now()},
  comments: [{
    user: { type: String, required:true },
    text: { type: String, required:true },
    createdAt: {type:Date, default:Date.now()}
  }]
},{versionKey:false});

const PostModel=mongoose.model("post",postSchema);

module.exports={PostModel};