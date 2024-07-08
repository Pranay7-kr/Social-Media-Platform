import mongoose from "mongoose";
import commentsSchemas from "./Schemas/comments.schemas.js";
import { ObjectId } from "mongodb";
import ApplicationError from "../../error-handler/applicationError.js";
import { postModel } from "../post/posts.repository.js";
import { likesModel } from "../like/likes.repository.js";

export const commentsModel = mongoose.model('Comment', commentsSchemas);

export default class CommentsRepository {


    async addComment(text, userId, postId) {
        try {
            const comment = new commentsModel({
                text: text,
                postId: new ObjectId(postId),
                userId: new ObjectId(userId)
            });

            const newComment = await comment.save();
            return newComment;
        } catch (err) {
            throw err;
        }
    }

    async getComments(postId) {
        try {
            const comments = await commentsModel.find({ postId: new ObjectId(postId) }).select(['-_id', '-postId', '-userId']);
            if (!comments || comments.length == 0) {
                throw new ApplicationError("comments not found", 404);
            }

            return comments;
        } catch (err) {
            throw err;
        }
    }

    async updateComment(commentId, userId, text) {
        try {
            const comment = await commentsModel.findById({ _id: new ObjectId(commentId) });
            if (!comment) {
                throw new ApplicationError("Comment not found", 404);
            }
            const post = await postModel.findById({ _id: new ObjectId(comment.postId) });
            if (!post) {
                throw new ApplicationError("Post not found", 404);
            }

            if (comment.userId == userId) {
                const updatedComment = await commentsModel.findByIdAndUpdate({ _id: new ObjectId(commentId) }, {
                    text: text,
                },
                    { new: true, select: '-_id -userId -postId' });
                return updatedComment;
            } else {
                throw new ApplicationError("Unauthorized", 403);

            }

        } catch (err) {
            throw err;
        }
    }

    async deleteComment(commentId, userId) {
        try {
            const comment = await commentsModel.findById({ _id: new ObjectId(commentId) });
            if (!comment) {
                throw new ApplicationError("Comment not found", 404);
            }
            const post = await postModel.findById({ _id: new ObjectId(comment.postId) });
            if (!post) {
                throw new ApplicationError("Post not found", 404);
            }

            if (comment.userId == userId || post.userId == userId) {
                await comment.deleteOne();
                await likesModel.deleteMany({likeable: new ObjectId(commentId), types: 'Comment'});
            } else {
                throw new ApplicationError("Unauthorized", 403);
            }

        } catch (err) {
            throw err;
        }
    }
}
