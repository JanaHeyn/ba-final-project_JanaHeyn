import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';

mongoose    
    .connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
    .then(() => console.log('Connected to database'))
    .catch((err) => console.log('Connection failed', err.message));
