import mongoose from "mongoose";
import OTPRepository from "./otp.repository.js";

export default class OTPController {

    constructor() {
        this.otpRepository = new OTPRepository();
    }


    async sendOTP(req, res, next) {
        try {
            const result = await this.otpRepository.sendOTP(req);
            res.status(200).send(result);
        } catch (err) {
            next(err);
        }
    }

    async verifyOTP(req, res, next) {
        try {
            const validate = await this.otpRepository.verifyOTp(req);
            res.status(200).send(validate);
        } catch (err) {
            next(err);
        }
    }

    async resetPassword(req,res, next){
        try{
            const reseting = await this.otpRepository.resetPassword(req);
            res.status(201).send(reseting);
        }catch(err){
            next(err);
        }
    }
}