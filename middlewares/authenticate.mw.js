const jwt=require("jsonwebtoken");
require("dotenv").config();

const authenticate=(req,res,next)=>{
    const token=req.headers.authorization;
    if(token){
        jwt.verify(token,process.env.key,(err,decoded)=>{
            if(decoded){
                req.body.userID=decoded.userID;
                next();
            }else{
                res.send({"msg":"Not authorized","err":err.message});
            }
        })
    }else{
        res.send({"msg":"not Authorized"});
    }
};

module.exports={authenticate};