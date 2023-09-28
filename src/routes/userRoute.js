/** EXTERNE DEPENDENCIES */
import express from 'express';
import { Router } from 'express';


/** IMPORTS */
import { createUser, loginUser, getUser, getUsers, deleteUser, deleteAllUsers,  updateUser, clearCookie, bookActivity, removeActivity } from '../controllers/userController.js';
import authAdmin from '../middlewares/authAdmin.js';
import authUser from '../middlewares/authUser.js' ;
import {userPostValidation, userPutValidation } from '../validation/userValidation.js';

/** VARIABLEN */
const userRouter = Router();

// login
userRouter
    .post('/user/login', loginUser);


// alle user anzeigen lassen
userRouter
    .get('/users', 
        authAdmin,
        getUsers)
    .delete('/users', 
        authAdmin,
        deleteAllUsers);


// user erstellen
userRouter
    .post('/user', 
        userPostValidation,
        createUser)

// activity buchen
userRouter
    .post('/user/addActivity/:activityId',
        authUser,
        bookActivity);

// activity löschen
userRouter
    .delete('/user/removeActivity/:activityId',
        authUser,
        removeActivity);        

// einzelner User bearbeiten, löschen, anzeigen lassen
userRouter
    .get('/user/:id', 
        authUser,
        getUser)
    .put('/user/:id', 
        authUser,
        userPutValidation,
        updateUser)
    .delete('/user/:id', 
        authUser,
        deleteUser);

// logout
userRouter
    .post('/user/logout', 
        authUser,
        clearCookie);

export default userRouter;
