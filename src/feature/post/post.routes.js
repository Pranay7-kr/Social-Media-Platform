import express from 'express';
import PostController from './posts.controller.js';
import { upload } from '../../midleware/fileUpload.midleware.js';

const postRouter = express.Router();

const postController = new PostController();


postRouter.post('/', upload.single('imageUrl'), (req,res,next)=>{
    postController.createPost(req,res,next);
});

postRouter.get('/:postId', (req,res,next)=>{
    postController.postById(req,res,next);
});

postRouter.get('/', (req,res,next)=>{
    postController.postBYSpecificUser(req,res,next);
});

postRouter.delete('/:postId', (req,res,next)=>{
    postController.deletePost(req,res,next);
});

postRouter.put('/:postId', upload.single('imageUrl'), (req,res,next)=>{
    postController.updatePost(req,res,next);
});


export default postRouter;