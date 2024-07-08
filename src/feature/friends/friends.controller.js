import ApplicationError from "../../error-handler/applicationError.js";
import FriendsRepository from "./friends.repository.js";


export default class FriendsController{
    
    constructor(){
        this.friendsRepository = new FriendsRepository();
    }

    async sendFriendRequest(req, res, next){
        try{
            const userId = req.id;
            const {friendId} = req.params;
            await this.friendsRepository.sendFriendRequest(userId, friendId);
            res.status(201).send("you have successfuly send a freind request");
        }catch(err){
            next(err);
        }
    }

    async getFriends(req, res, next){
        try{
            const {userId} = req.params;
            const friends = await this.friendsRepository.getFriends(userId);
            res.status(200).send(friends);
        }catch(err){
            next(err);
        }
    }

    async getPendingRequest(req, res, next){
        try{
            const userId = req.id;
            const friendsReq = await this.friendsRepository.getPendingRequest(userId);
            res.status(200).send(friendsReq);
        }catch(err){
            next(err);
        }
    }

    async toggleFriendRequest(req, res, next){
        try{
            const userId = req.id;
            const {friendId} = req.params;
            const {type} = req.query;
            if(type != 'accept' && type != 'reject'){
                throw new ApplicationError("Invalid Type", 400);
            }
            let response;
            if(type == 'accept'){
                response = await this.friendsRepository.acceptRequest(userId, friendId);
            }else{
                response = await this.friendsRepository.rejectRequest(userId, friendId);
            }

            res.status(200).send(response);

        }catch(err){
            next(err);
        }
    }

}