import PostRepository from "./posts.repository.js";


export default class PostController{

    constructor(){
        this.postRepository = new PostRepository();
    }

    async createPost(req, res, next){
        try{
            const caption = req.body.caption;
            const userId = req.id;
            let imageUrl;
            if(req.file){
            imageUrl = req.file.filename;
            }
            console.log(userId);
            const newPost = await this.postRepository.createPost(caption, userId, imageUrl);
            return res.status(201).send(newPost);
        }catch(err){
            next(err);
        }
    }

    async postById(req, res, next){
        try{
            const {postId} = req.params;
            const post = await this.postRepository.postById(postId);
            res.status(200).send(post);
        }catch(err){
            next(err);
        }
    }

    async postBYSpecificUser(req,res,next){
        try{
            const {userId} = req.body;
            const posts = await this.postRepository.postBYSpecificUser(userId);
            res.status(200).send(posts);
        }catch(err){
            next(err);
        }
    }

    async deletePost(req,res, next){
        try{
            const {postId} = req.params;
            const userId = req.id;
            await this.postRepository.deletePost(userId, postId);
            res.status(200).send("post is deleted successfuly");
        }catch(err){
            next(err);
        }
    }

    async updatePost(req,res, next){
        try{
            const {postId} = req.params;
            const caption = req.body.caption;
            const imageUrl = req.file.filename;
            const userId = req.id;
            const updatePost = await this.postRepository.updatePost(caption, imageUrl, userId, postId);
            res.status(201).send(updatePost);
        }catch(err){
            next(err);
        }
    }


}