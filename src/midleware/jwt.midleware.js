import jwt from  'jsonwebtoken';
import ApplicationError from '../error-handler/applicationError.js';
import { tokenBlackListModel } from '../feature/user/users.repository.js';

const jwtAuth = async (req,res,next)=>{
    const token = req.headers["authorization"];
    
    if(!token){
        throw new ApplicationError("Unauthorized", 401);
    }

    const isBlackListed = await tokenBlackListModel.findOne({token});

    if(isBlackListed){
        throw new ApplicationError("Token has been invalidated", 401);
    }

    try{
        const playload = jwt.verify(token, process.env.JWT_SECRET);
        req.id = playload._id;
        req.email = playload.email;
    }catch(err){
        throw new ApplicationError("token is not valid", 401);
    }
    next();
}


export default jwtAuth;