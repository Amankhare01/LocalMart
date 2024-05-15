import JWT from "jsonwebtoken";
import shopmodel from "../models/shopmodel.js"
export const requiresign = async(req,res,next)=>{
    try{
        const decode = JWT.verify(
            req.headers.authorization,
            process.env.JWT_SEC
        );
        req.shops = decode;
        next();
    }catch (error){
        console.log(error);
    }
};

export const isadmin = async(req,res,next)=>{
    try{
        const shops = await shopmodel.findById(req.shops._id)
        if(shops.role !== 1){
            return res.status(401).send({
                success:false,
                message:"Unauthorized Shop"
            })
        }
        else{
            next();
        }
    }
    catch(error){
        console.log(error);
        res.status(401).send({
            success:false,
            error,
            message:"Error in Admin Middleware"
        })
    }
}