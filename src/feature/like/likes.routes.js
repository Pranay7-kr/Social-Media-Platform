import express from 'express';

import LikesController from './likes.controller.js';

const likeRouter = express.Router();

const likeController = new LikesController();


likeRouter.post('/toggle/:id', (req,res,next)=>{
    likeController.toggleLike(req,res,next);
});

likeRouter.get('/:id', (req,res,next)=>{
    likeController.getLikes(req,res,next);
});

export default likeRouter;

