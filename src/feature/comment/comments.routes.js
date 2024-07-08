import express from 'express';
import CommentsController from './comments.controller.js';

const commentRouter = express.Router();

const commentsController = new CommentsController();

commentRouter.post('/:postId', (req,res,next)=>{
    commentsController.addComment(req,res,next);
});

commentRouter.get('/:postId', (req,res,next)=>{
    commentsController.getComments(req,res,next);
});

commentRouter.put('/:commentId', (req,res,next)=>{
    commentsController.updateComment(req,res,next);
});

commentRouter.delete('/:commentId', (req,res,next)=>{
    commentsController.deleteComment(req,res,next);
});

export default commentRouter;