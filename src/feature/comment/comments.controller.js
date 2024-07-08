import CommentsRepository from "./comments.repository.js";


export default class CommentsController{

    constructor(){
        this.commentsRepository = new CommentsRepository();
    }


    async addComment(req,res,next){
        try{
            const {text} = req.body;
            const userId = req.id;
            const {postId} = req.params;
            const newCommet = await this.commentsRepository.addComment(text, userId, postId);
            res.status(201).send(newCommet);
        }catch(err){
            next(err);
        }
    }

    async getComments(req,res, next){
        try{
            const {postId} = req.params;
            const comments = await this.commentsRepository.getComments(postId);
            res.status(200).send(comments);
        }catch(err){
            next(err);
        }
    }

    async updateComment(req,res, next){
        try{
            const {commentId} = req.params;
            const {text} = req.body;
            const userId = req.id;
            const updatedComment = await this.commentsRepository.updateComment(commentId, userId, text);
            res.status(201).send(updatedComment);
        }catch(err){

        }
    }

    async deleteComment(req,res, next){
        try{
            const {commentId} = req.params;
            const userId = req.id;
            await this.commentsRepository.deleteComment(commentId, userId);
            res.status(201).send("Comment deleted successfuly");
        }catch(err){
            next(err);
        }
    }
}