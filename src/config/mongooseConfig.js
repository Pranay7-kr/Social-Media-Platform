import mongoose from "mongoose";

export const connectUsingMongoose = async ()=>{
    try{
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useNewUrlParser: true,
        });
        console.log("MongoDB is Connected");
    }catch(err){
        console.log("Error while connecting to the DB");
        console.log(err);
    }
}