import express from 'express';
import OTPController from './otp.controller.js';
// import jwtAuth from '../../midleware/jwt.midleware';

const otpRouter = express.Router();

const otpController = new OTPController();


otpRouter.post('/send', (req,res,next)=>{
    otpController.sendOTP(req,res,next);
});

otpRouter.post('/verify', (req,res,next)=>{
    otpController.verifyOTP(req,res,next);
});

otpRouter.post('/reset-password', (req,res,next)=>{
    otpController.resetPassword(req,res,next);
});


export default otpRouter;