import mongoose from "mongoose";
import otpSchema from "./Schemas/otp.schemas.js";
import * as nodemailer from 'nodemailer';
import ApplicationError from "../../error-handler/applicationError.js";
import { userModel } from "../user/users.repository.js";
import bcrypt from 'bcrypt';

const otpMOdel = mongoose.model('OTP', otpSchema);


export default class OTPRepository {

    async sendOTP(req) {
        const otp = Math.floor(100000 + Math.random() * 900000);
        const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
        //1. Create transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });



        const mailOptions = {
            from: process.env.EMAIL,
            to: req.email,
            subject: "Reset Password",
            text: `For reseting the password ${otp}`
        };

        try {
            const result = await transporter.sendMail(mailOptions);
            await otpMOdel.deleteOne({ email: req.email });

            await otpMOdel.create({
                email: req.email,
                otp: otp.toString(),
                expiresAt: expiresAt
            })
            return "OTP send successfuly";
        } catch (err) {
            throw err;
        }
    }


    async verifyOTp(req) {
        try {
            const otpRecord = await otpMOdel.findOne({ email: req.email });
            if (!otpRecord) {
                throw new ApplicationError("OTP not found", 400);
            }
            const currentTime = new Date();
            if (currentTime > otpRecord.expiresAt) {
                throw new ApplicationError("OTP has expired", 400);
            }

            if (otpRecord.otp == req.body.otp) {
                otpRecord.verified = true;
                await otpRecord.save();
                return "you can reset your password";
            }

            throw new ApplicationError("OTP is incorrect, please re-enter the OTP", 400);
        } catch (err) {
            throw err;
        }
    }

    async resetPassword(req){
        try{
            const user = await userModel.findOne({email: req.email});
            if(!user){
                throw new ApplicationError("user not found, pls register your account",401);
            }
            const password = req.body.password;
            const hashPassword = await bcrypt.hash(password, 12);
            const otpVerify = await otpMOdel.findOne({email: req.email});
            if(!otpVerify){
                throw new ApplicationError("you can't reset you password, pls send you otp on registered email than reset your password",400);
            }
            if(otpVerify.verified){
                user.password = hashPassword;
                await user.save();
                await otpMOdel.deleteOne({email: req.email});
                return "Your email password reset successfuly";
            }

            throw new ApplicationError("pls verify your otp first!",400);

        }catch(err){
            throw err;
        }
    }
}