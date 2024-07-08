import mongoose from "mongoose";

const commentsSchemas = mongoose.Schema({
    text: {
        type: String,
        require: [true, "text should be required"],
        minlength: [3, "comment should be greater than 3 character"]
    },

    postId : {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "post should be required"],
        ref: 'Posts'
    },

    userId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

export default commentsSchemas;