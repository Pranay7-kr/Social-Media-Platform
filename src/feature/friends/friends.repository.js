import { ObjectId } from "mongodb";
import { userModel } from "../user/users.repository.js";
import ApplicationError from "../../error-handler/applicationError.js";
import * as nodemailer from 'nodemailer';



export default class FriendsRepository {


    async sendFriendRequest(userId, friendId) {

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        try {
            const receiver = await userModel.findById({ _id: new ObjectId(friendId) });
            if (!receiver) {
                throw new ApplicationError("friend not found", 404);
            }

            if (receiver.friendReq.includes(new ObjectId(userId))) {
                throw new ApplicationError("Friend request already send", 400);
            }

            receiver.friendReq.push(new ObjectId(userId));
            await receiver.save();

            const mailOptions = {
                from: process.env.EMAIL,
                to: receiver.email,
                subject: "Notification",
                text: `You have one new friend request.`
            };

            await transporter.sendMail(mailOptions);

        } catch (err) {
            throw err;
        }
    }

    async getFriends(userId) {
        try {
            const user = await userModel.findById({ _id: new ObjectId(userId) }).populate({ path: 'friend', select: '_id name' });
            if (!user.friend || user.friend.length == 0) {
                throw new ApplicationError("You have no friends", 404);
            }

            return user.friend;
        } catch (err) {
            throw err;
        }
    }

    async getPendingRequest(userId) {
        try {
            const user = await userModel.findById({ _id: new ObjectId(userId) }).populate({path: 'friendReq', select: '_id name'});
            if (!user.friendReq || user.friendReq.length == 0) {
                throw new ApplicationError("You have no pending friends request", 404);
            }

            return user.friendReq;
        } catch (err) {
            throw err;
        }
    }

    async acceptRequest(userId, friendId) {
        try {
            const user = await userModel.findById({ _id: new ObjectId(userId) });
            const findIndex = user.friendReq.findIndex(req => req.equals(new ObjectId(friendId)));
            if (findIndex == -1) {
                throw new ApplicationError("Friend request not found", 404);
            }
            
            const acceptFriendRequest = user.friendReq[findIndex];
            
            user.friend.push(acceptFriendRequest);
            
            user.friendReq.splice(findIndex, 1);

            await user.save();
            return `Friend request accepted successfully.`;
        } catch (err) {
            throw err;
        }
    }

    async rejectRequest(userId, friendId) {
        try {
            const user = await userModel.findById({ _id: new ObjectId(userId) });
            const findIndex = user.friendReq.findIndex(req => req.equals(new ObjectId(friendId)));
            if (findIndex == -1) {
                throw new ApplicationError("Friend request not found", 404);
            }
            user.friendReq.splice(findIndex, 1);
            await user.save();
            return "rejected successfuly";
        } catch (err) {
            throw err;
        }
    }
}