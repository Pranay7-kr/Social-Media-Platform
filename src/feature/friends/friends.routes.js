import express from 'express';
import FriendsController from './friends.controller.js';


const friendsRouter = express.Router();

const friendsController = new FriendsController();

friendsRouter.post('/toggle-friendship/:friendId', (req, res, next)=>{
    friendsController.sendFriendRequest(req, res, next);
});

friendsRouter.get('/get-friends/:userId', (req, res, next)=>{
    friendsController.getFriends(req, res, next);
});

friendsRouter.get('/get-pending-requests', (req, res, next)=>{
    friendsController.getPendingRequest(req, res, next);
});

friendsRouter.put('/response-to-request/:friendId', (req, res, next)=>{
    friendsController.toggleFriendRequest(req, res, next);
});

export default friendsRouter;