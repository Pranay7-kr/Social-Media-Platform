import mongoose from "mongoose";
import { likeSchema } from "./Schemas/like.schemas.js";
import { ObjectId } from "mongodb";
import { postModel } from "../post/posts.repository.js";
import ApplicationError from "../../error-handler/applicationError.js";
import { commentsModel } from "../comment/comments.repository.js";

export const likesModel = mongoose.model('Like', likeSchema);

export default class LikeRepository{

    async likePost(userId, id){
        try{
            const post = await postModel.findById({_id: new ObjectId(id)});
            if(!post){
                throw new ApplicationError("post not found", 404);
            }
            const user = await likesModel.findOne({user: new ObjectId(userId), likeable: new ObjectId(id)});
            if(user){
                await user.deleteOne();
                return "you dislike the post";
            }
            const newLike = new likesModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(id),
                types: 'Posts'
            });

            await newLike.save();
            return "you like the post";
        }catch(err){
            throw err;
        }
    }

    async likeComment(userId, id){
        try{
            const comment = await commentsModel.findById({_id: new ObjectId(id)});
            if(!comment){
                throw new ApplicationError("comment not found", 404);
            }
            const user = await likesModel.findOne({user: new ObjectId(userId), likeable: new ObjectId(id)});
            if(user){
                await user.deleteOne();
                return "you dislike the comment";
            }
            const newLike = new likesModel({
                user: new ObjectId(userId),
                likeable: new ObjectId(id),
                types: 'Comment'
            });

            await newLike.save();
            return "you like the comment";
        }catch(err){
            throw err;
        }
    }

    async getLikes(type, id){
        try{
            const likes =  await likesModel.find({
                likeable: new ObjectId(id),
                types: type
            }).populate({path: 'user', select: 'id name email'}). populate({path: 'likeable', select: 'id caption image', model: type});

            if(!likes || likes.length ==0){
                throw new ApplicationError("like not found", 404);
            }

            return likes;
        }catch(err){
            throw err;
        }
    }


}