import ApplicationError from "../../error-handler/applicationError.js";
import LikeRepository from "./likes.repository.js";


export default class LikesController{

    constructor(){
        this.likesRepository = new LikeRepository();
    }


    async toggleLike(req, res, next){
        try{
            const userId = req.id;
            const {type} = req.query;
            const {id} = req.params;
            if(type != 'Posts' && type != 'Comment'){
                throw new ApplicationError('Invalid type', 400);
            }
            let like;
            if(type == 'Posts'){
                like = await this.likesRepository.likePost(userId, id);
            }else{
                like = await this.likesRepository.likeComment(userId, id);
            }
            res.status(201).send(like);
        }catch(err){
            next(err)
        }
    }

    async getLikes(req, res, next){
        try{
            const {id} = req.params;
            const {type} = req.query;
            const likes = await this.likesRepository.getLikes(type, id);
            res.status(200).json({
                like: likes.length,
                likse: likes
            });
        }catch(err){
            next(err)
        }
    }
}