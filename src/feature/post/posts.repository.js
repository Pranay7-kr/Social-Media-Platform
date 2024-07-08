import mongoose from "mongoose";
import postSchemas from "./Schemas/posts.schemas.js";
import { ObjectId } from "mongodb";
import ApplicationError from "../../error-handler/applicationError.js";
import { commentsModel } from "../comment/comments.repository.js";
import { likesModel } from "../like/likes.repository.js";

export const postModel = mongoose.model('Posts', postSchemas);

export default class PostRepository{

    async createPost(caption, userId, imageUrl){
        try{
            const post = new postModel({
                caption: caption,
                image: imageUrl,
                userId: new ObjectId(userId)
            });

            const newPost = await post.save();
            return newPost; 
        }catch(err){
            throw err;
        }
    }

    async postById(id){
        try{
            const post = await postModel.findById({_id: new ObjectId(id)}).select('-_id');
            if(post){
                return post;
            }

            throw new ApplicationError("Post not found", 404);
        }catch(err){
            throw err;
        }
    }

    async postBYSpecificUser(userId){
        try{
            const posts = await postModel.find({userId: new ObjectId(userId)}).select(['-_id', '-userId']);
            if(!posts || posts.length == 0){    
                throw new ApplicationError("user didn't post anything", 404);
            }
            return posts;
        }catch(err){
            throw err;
        }
    }

    async deletePost(userId, postId){
        try{
            const post = await postModel.findById({_id: new ObjectId(postId)});
            if(!post){
                throw new ApplicationError("Post not found", 404);
            }
            if(post.userId != userId){
                throw new ApplicationError("Unauthorozid", 403);
            }

            await post.deleteOne();
            await commentsModel.deleteMany({postId: new ObjectId(postId)});
            await likesModel.deleteMany({likeable: new ObjectId(postId), types: 'Posts'});
        }catch(err){
            throw err;
        }
    }

    async updatePost(caption, imageUrl, userId, postId){
        try{
            const post = await postModel.findById({_id: new ObjectId(postId)});
            if(!post){
                throw new ApplicationError("Post not found", 404);
            }
            if(post.userId != userId){
                throw new ApplicationError("Unauthorozid", 403);
            }
            const updatedPost = await postModel.findByIdAndUpdate({_id: new ObjectId(postId)}, {
                caption: caption,
                image: imageUrl
            },
            { new: true, select: '-_id -userId' });
            return updatedPost;
        }catch(err){
            throw err;
        }
    }


}