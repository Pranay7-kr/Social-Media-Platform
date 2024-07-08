import './env.js'
import express from 'express';
import bodyParser from 'body-parser';

import cors from 'cors';
import { connectUsingMongoose } from './src/config/mongooseConfig.js';
import userRouter from './src/feature/user/users.routes.js';
import ApplicationError from './src/error-handler/applicationError.js';
import jwtAuth from './src/midleware/jwt.midleware.js';

import apiDocs from './swagger.json' assert {type: 'json'};
// const apiDocs = JSON.parse(fs.readFileSync(path.resolve('swagger.json'), 'utf-8'));
import otpRouter from './src/feature/OTP_Folder/otp.routes.js';
import postRouter from './src/feature/post/post.routes.js';
import commentRouter from './src/feature/comment/comments.routes.js';
import likeRouter from './src/feature/like/likes.routes.js';
import friendsRouter from './src/feature/friends/friends.routes.js';
import { logger } from './src/midleware/logger.midleware.js';

const app = express();

app.use(cors());
// app.use(express.static('postway2'));
app.use('/api-docs', swagger.serve, swagger.setup(apiDocs));

app.use(bodyParser.json());
app.use(express.json());


app.use('/api/users', userRouter);
app.use('/api/otp', jwtAuth, otpRouter);
app.use('/api/posts', jwtAuth, postRouter);
app.use('/api/comments', jwtAuth, commentRouter);
app.use('/api/likes', jwtAuth, likeRouter);
app.use('/api/friends', jwtAuth, friendsRouter);
app.get('/', (req, res, next) => {
    res.send("welcome to the server");

});



app.use((err, req, res, next) => {
    if (err instanceof ApplicationError) {
        return res.status(err.code).send(err.message);
    } else if (err.name === 'ValidationError') {
        const errorMessages = Object.values(err.errors).map(err => err.message);
        return res.status(400).send(errorMessages);
    } else {
        logger.log({
            level: 'error',
            message: `TimeStamp: ${new Date().toString()} req URL: ${req.url} error msg: ${err.message}.`
        });
        console.log(err);
        return res.status(500).send('something went wrong, please try again later');
    }

})




app.listen(6000, () => {
    console.log("app is listening");
    connectUsingMongoose();
})