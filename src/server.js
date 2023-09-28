/** EXTERNE DEPENDENCIES */
import express from 'express';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';

/** IMPORTS */
import setCors from './middlewares/cors.js';
import userRouter from './routes/userRoute.js';
import activityRouter from './routes/activityRoute.js';

/** VARIABLEN */
const app = express();
const port = process.env.PORT

/** DATENBANK */
import './config/db.js';

/** MIDDLEWARE */
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get('/api/records/middleware', setCors, (req, res) => {
    console.log('Test...');
    res.send('middleware-test');
});



/** ROUTEN */
app.use('/api', userRouter);
// Sportarten durchsuchen
// /search

app.use('/api', activityRouter);


/** ERROR HANDLING */
app.use((req, res, next) => {
    const error = new Error('Sorry, page not found!');
    error.status = 404;
    next(error);
});

app.use((err, req, res, next) => {
    return res
        .status(err.status || 500)
        .json({
            message: err.message
        });
});


/** LISTENER */
app.listen(port, () => console.log('Server running on port', port));
