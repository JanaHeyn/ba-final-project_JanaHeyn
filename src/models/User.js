/** EXTERNE DEPENDENCIES */
import mongoose from 'mongoose';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

/** IMPORTS */
// import Activity from './Activity.js';

/** VARIABLES */
const secret = process.env.SECRET_TOKEN;

const userSchema = new mongoose.Schema({
    firstname: { type: String, trim: true },
    lastname: { type: String, trim: true },
    admin: {
        type: Boolean,
        default: false
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        trim: true,
        required: true
    },
    // gebuchte aktivitäten mit verweis darauf
    bookedActivities: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Activity'
    }]
});

userSchema.methods.hashPassword = (password) => {
    return crypto
        .createHmac('sha256', secret)
        .update(password)
        .digest('hex');
};

userSchema.methods.comparePassword = function(loginPassword) {
    if (this.password !== this.hashPassword(loginPassword)) {
        return false;
    }
    return true;
};


// to generate a production based secret for the .env file:
// console.log(crypto.randomBytes(64).toString('hex'));

const User = new mongoose.model('User', userSchema, 'users');

export default User;
