import mongoose from "mongoose";

export const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "name should be required"],
        minlength: [3, "name should be greater than 3 character"],
    },

    email: {
        type: String,
        required: [true, "Email is require"],
        unique: [true, "Email is already in use"],
        match: [/.+\@.+\../, "Please enter a vailid email"] 
    },
    gender:{
        type: String,
        required: [true, "gender is required"],
        enum: ['Male', 'Female', 'Other']
    },

    avatar: {
        type: String,
        required: [true, 'image should be require']
    },

    password:{
        type: String,
        require: [true, "password is required"],
        // validate: {
        //     validator: (value)=>{
        //         const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
        //         return regex.test(value);
        //     },
        //     message: props=> `${props.value} is not a valid password! Password must contain at least one upperCase character, one lowerCase character, one number and one special character.`
        // }  

    },

    friendReq: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    friend: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    ],

    tokens: [{
        token: {
            type: String,
            // required: true,
        }
    }]

});