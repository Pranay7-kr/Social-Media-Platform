import mongoose from "mongoose";
import { userSchema } from "./Schemas/user.schemas.js";
import ApplicationError from "../../error-handler/applicationError.js";
import jwt from 'jsonwebtoken';
import { tokenBlackListSchema } from "./Schemas/blackList.schemas.js";
import bcrypt from 'bcrypt';
import { ObjectId } from "mongodb";
import * as nodemailer from 'nodemailer';

export const userModel = new mongoose.model('User', userSchema);
export const tokenBlackListModel = new mongoose.model('TokenBlackLIst', tokenBlackListSchema);

export default class UserRepository {

    async signUp(userData) {
        try {
            const existingUser = await userModel.findOne({ email: userData.email });
            if (!existingUser) {
                const newUser = new userModel(userData);
                await newUser.save();
                return newUser;
            }
            throw new ApplicationError("Email is already in use", 400);
        } catch (err) {
            console.log(err);
            console.log("Something wrong with database");
            throw err;
        }
    }

    async findByEmail(req, email, password) {
        try {
            
            const user = await userModel.findOne({ email });
            if (!user) {
                throw new ApplicationError("user not found", 404);
            }
            const result = await bcrypt.compare(password, user.password);
            if (result) {
                const token = jwt.sign({ _id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });
                user.tokens = user.tokens.concat({token});
                await user.save();
                return token;
            }
            throw new ApplicationError("Incorrect Password", 400);
        } catch (err) {
            throw err;
        }
    }

    async logOut(req) {
        try {
            const token = req.headers["authoriztion"];
            if (!token) {
                throw new ApplicationError("Unauthorized", 401);
            }
            const decoded = jwt.decode(token);
            const expiresAt = new Date(decoded.exp * 1000);
            const blackListedToken = new tokenBlackListModel({ token, expiresAt });
            await blackListedToken.save();
        } catch (err) {
            throw err;
        }
    }

    async logoutAllDevices(req){
        try{
            const user = await userModel.findOne({email: req.email});
            if(!user){
                throw new ApplicationError("user not found", 404);
            }
            user.tokens = [];
            await user.save();
            return true;
        }catch(err){
            throw err
        }
    }

    async getAll(){
        try{
            const users = await userModel.find().select(['-password', '-tokens']);
            if(users.length == 0){
                throw new ApplicationError("there are no user on the server",404);
            }
            return users;
        }catch(err){
            throw err;
        }
    }

    async getById(id){
        try{
            const user = await userModel.findById({_id: new ObjectId(id)}).select(['-password', '-tokens']);
            if(!user){
                throw new ApplicationError("user not found", 404);
            }
            return user;
        }catch(err){
            throw err;
        }
    }

    async updatedata(userId,updatesData, avatar){
        try{
            const {password, tokens, ...allowedUpdates} = updatesData;
            const updateUser = await userModel.findByIdAndUpdate({_id: new ObjectId(userId)}, {...allowedUpdates, avatar: avatar}, {new: true, runValidators: true}).select(['-password', '-tokens']);
            if(!updateUser){
                throw new ApplicationError("user not found", 404);
            }
            return updateUser;
        }catch(err){
         throw err;   
        }
    }

}