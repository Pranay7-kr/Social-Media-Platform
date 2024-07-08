import express from 'express';
import UserController from './users.controller.js';
import jwtAuth from '../../midleware/jwt.midleware.js';
import { upload } from '../../midleware/fileUpload.midleware.js';


const userRouter = express.Router();

const userController = new UserController();

userRouter.post('/signup',upload.single('imageUrl'), (req,res, next)=>{
    userController.signUp(req,res,next);
});

userRouter.post('/signin', (req,res, next)=>{
    userController.signIn(req,res,next);
});

userRouter.post('/logout', jwtAuth, (req,res, next)=>{
    userController.logout(req,res,next);
});

userRouter.post('/logoutAll', jwtAuth, (req,res, next)=>{
    userController.logoutAllDevices(req,res,next);
});

userRouter.put('/updates-details/:userId', jwtAuth, upload.single('imageUrl'),  (req,res,next)=>{
    userController.updateUserData(req,res,next);
});

userRouter.get('/get-details/:userId', (req,res, next)=>{
    userController.getById(req,res,next);
});

userRouter.get('/get-all-details/', (req,res, next)=>{
    userController.getAll(req,res,next);
});


export default userRouter;