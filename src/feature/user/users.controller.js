import ApplicationError from "../../error-handler/applicationError.js";
import UserRepository from "./users.repository.js";
import bcrypt from 'bcrypt';

export default class UserController {

    constructor() {
        this.userRepository = new UserRepository();
    }


    async signUp(req, res, next) {
        try {
            const { name, email, gender, password } = req.body;
            const hashPassword = await bcrypt.hash(password, 12);
            const user = {
                name: name,
                email: email,
                gender: gender,
                avatar: req.file.filename,
                password: hashPassword
            }
            await this.userRepository.signUp(user);
            res.status(201).send(user);
        } catch (err) {
            next(err);
        }
    }

    async logout(req, res, next){
        try{
            await this.userRepository.logOut(req);
            res.status(200).send("logOut successfully");
        }catch(err){
            next(err);
        }
    }

    async signIn(req, res, next) {
        try {
            console.log(req.body.email);
            const token = await this.userRepository.findByEmail(req, req.body.email, req.body.password);
            res.status(200).send(token);
        } catch (err) {
            next(err);
        }
    }

    async logoutAllDevices(req,res,next){
        try{
            await this.userRepository.logoutAllDevices(req);
            res.status(200).send("Logged out from all devices successfully");
        }catch(err){
            next(err);
        }
    }

    async getAll(req, res,next){
        try{
            const users = await this.userRepository.getAll();
            res.status(200).send(users);
        }catch(err){
            next(err);
        }
    }

    async getById(req, res, next){
        try{
            const {userId } = req.params;
            const user = await this.userRepository.getById(userId);
            res.status(200).send(user);
        }catch(err){
            next(err);
        }
    }

    async updateUserData(req, res, next){
        try{
            const {userId } = req.params;
            
            if(userId == req.id){
            const updatedUser = await this.userRepository.updatedata(userId, req.body, req.file.filename);
            res.status(201).send(updatedUser);
            }else{
                throw new ApplicationError("Unauthorized user", 401);
            }
        }catch(err){
            next(err);
        }
    }

}