import mongoose from "mongoose";

 const postSchemas = mongoose.Schema({
    caption: {
        type: String,
        required: [true, "caption should be string"],
        minlength: [3, "caption should be greater than 3 character"]
    },
    image: {
        type: String,
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
});

export default postSchemas;