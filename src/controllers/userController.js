/** EXTERNE DEPENDENCIES */
import validator, { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import dotenv from 'dotenv';
dotenv.config();

/** IMPORTS */
import User from '../models/User.js';
import Activity from '../models/Activity.js';

/** VARIABLEN */
const secret = process.env.SECRET_TOKEN;


export const createUser = async(req, res, next) => {
    try {
        const { firstname, lastname, admin, username, password } = req.body;

        const error = validator.validationResult(req).errors;
        if(error.length > 0) {
            return res.status(400).json({
                success: false,
                msg: error.map(err => err.msg)
            });
        };

        const alreadyExists = await User.find({ username });
        if(alreadyExists.length >= 1) {
            return res.status(409).json({
                success: false,
                msg: 'Email already exists!'
            });
        }

        const newUser = new User({
            firstname,
            lastname,
            admin,
            username,
            password
        });

        newUser.password = newUser.hashPassword(password);
        // console.log(newUser.bookedActivities);

        await newUser.save();
        res.status(201).json({
            success: true,
            message: `Horray! Welcome ${firstname}! You have successfully registered.`
        });

    } catch(err) {
        next(err);
    }
}


export const getUser = async(req, res, next) => {
    try {
        const { id } = req.params;
        if(req.userId === id) {
            const user = await User.findById(id).populate('bookedActivities', '-_id');
            res.status(200).json({
                success: true,
                data: user
        });
        } else {
            res.status(400).json({
                message: 'Sorry, you are not authorized!'
            });
        }
        
    } catch(err) {
        next(err);
    }
}


export const getUsers = async(req, res, next) => {
    try {
        const users = await User.find().populate('bookedActivities', '-_id');
        res.status(200).json({
            success: true,
            amount: users.length,
            data: users
        });

    } catch(err) {
        next(err);
    }
}


export const updateUser = async(req, res, next) => {
    try {
        const { id } = req.params;
        const {password} = req.body;
        // const updatedData = req.body

        // validierung + fehler
        const error = validator.validationResult(req).errors;
        if(error.length > 0 ) {
            return res.status(400).json({
                success: false,
                error: error
            });
        }; 

        // ids vergleichen (eingegebene mit in der db hinterlegte)
        if(id !== req.userId ) {
            return res.status(400).json({
                success: false,
                message: 'Sorry, but you are not authorized!'
            });
        }

        // wenn das passwort geädnert wird:
        if(password) {
            const newPWD = await User.findById(id);
            newPWD.password = crypto
            .createHmac("sha256", secret)
            .update(password)
            .digest("hex");

            await User.findByIdAndUpdate(
                id,
                {...req.body, password: newPWD.password},
                { new: true }
            );
            return res.status(200).json({
                success: true,
                message: 'Password successfully updated!'
            });
        }

        // alle anderen daten die geändert werden und nicht password sind
        const user = await User.findByIdAndUpdate(
            id,
            {...req.body},
            { new: true }
        );
        res.status(201).json({
            success: true,
            message: 'User data successfully updated!',
            data: user
        });

    } catch (err) {
        next(err);
    }
}


export const deleteUser = async(req, res, next) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        if(!user) throw new Error('User not found');
            
        if(id === req.userId) {
            const delUser = await User.findByIdAndDelete(id);
            return res.status(201).json({
                    success: true,
                    message: `${user.username} successfully deleted.`,
                    data: delUser
                })
        } else {
            return res.status(400).json({
                success: false,
                message: 'Soory, you are not authorized!'
            });
        }


    } catch(err) {
        next(err);
    }
}


export const deleteAllUsers = async(req, res, next) => {
    try {
        await User.deleteMany();
        res.status(201).json({
            success: true,
            message: 'All users deleted!'
        });

    } catch(err) {
        next(err);
    }
}


export const loginUser = async(req, res, next) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({username});
        // console.log(user);
        if(user) {
            if(user.comparePassword(password)) {
                const token = jwt.sign(
                    {   
                        username: user.username, 
                        userId: user._id, 
                        admin: user.admin
                        
                    }, 
                    secret
                    // {expiresIn: '24h'}
                    );

                res
                .cookie('access_token', token, 
                {
                    maxAge: 24 * 60 * 60 * 1000,
                    httpOnly: true
                })
                .status(200)
                .json({
                    success: true,
                    message: user.admin ? 'Hello ' + user.firstname + '! ' + 'May the force with you as an admin' : 'Hello ' + user.firstname + ', nice to see you again!',
                    
                });
            } else {
                res.status(401).json({
                    success: false,
                    message: 'Incorrect user login data!'
                });
            }
        } else {
            res.status(400).json({
                success: false,
                message: 'No user found! Please register.'
            });
        }

    } catch (err) {
        next(err);
    }
}


export const clearCookie = (req, res, next) => {
    return res
        .clearCookie('access_token')
        .status(201)
        .json({
            success: true,
            message: 'Successfully logged out!'
        });
}

export const bookActivity = async(req, res, next) => {
    try {
        const { activityId } = req.params;
        const userId = req.userId;

        // activity und user in der db suchen
        const activity = await Activity.findById(activityId);
        const user = await User.findById(userId);

        // und prüfen ob vorhanden
        if(!user || !activity) {
            res.status(400).json({
                success: false,
                message: 'User or Activity not found!'
            });
        }

        // prüfen ob activity schon vom user gebucht
        const activityFound = await User.findOne({bookedActivities: {$in: activityId}});
        if(activityFound) {
            return res.status(400).json({
                success: false,
                message: 'Activity already booked!'
            });
        }

        // user mit activities updaten und erweitern
        user.bookedActivities.push(activityId);
        console.log('user', user.firstname);

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Activity booked successfully',
            data: activity
        });

    } catch(err) {
        next(err);
    }
}

export const removeActivity = async(req, res, next) => {
    try {
        const { activityId } = req.params;
        const userId = req.userId;

        // activity und user in der db suchen
        const user = await User.findById(userId);
        const activity = await Activity.findById(activityId);

        // und prüfen ob vorhanden
        if(!user) {
            res.status(400).json({
                success: false,
                message: 'User not found!'
            });
        }

        // prüfen ob activity schon vom user gebucht
        const isActivityBooked = await User.findOne({bookedActivities: {$in: activityId}});
        if(!isActivityBooked) {
            return res.status(400).json({
                success: false,
                message: 'Activity not booked yet!'
            });
        }

        // activity vom user entfernen und updaten
        user.bookedActivities = user.bookedActivities.filter((bookedActivityId) => bookedActivityId === activityId);

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Activity deleted successfully',
            data: user
        });

    } catch(err) {
        next(err);
    }
}
