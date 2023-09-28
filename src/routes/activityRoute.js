/** EXTERNE DEPENDENCIES */
import { Router } from 'express';

/** IMPORTS */
import {createActivity, getActivity, getAllActivities, updateActivity, deleteActivity, deleteAllActivities, getActivitiesByCategory, getActivitiesByDate, getActivitiesByLocation} from '../controllers/activityController.js';
import authAdmin from '../middlewares/authAdmin.js';
import authUser from '../middlewares/authUser.js' ;

/** VARIABLEN */
const activityRouter = Router();

// alle activities anzeigen lassen
activityRouter
    .get('/activities', 
        authUser,
        getAllActivities)
    .delete('/activities', 
        authAdmin,
        deleteAllActivities)

// activities nach spez. filtern anzeigen lassen
activityRouter
    .get('/activities/date/:date',
        authUser,
        getActivitiesByDate)
    .get('/activities/category/:category',
        authUser,
        getActivitiesByCategory)
    .get('/activities/location/:location',
        authUser,
        getActivitiesByLocation);

// nach isAdmin, valActPost darf der Admin eine activity erstellen
activityRouter
    .post('/activity', 
        authAdmin,
        createActivity);

activityRouter
    .get('/activity/:id', getActivity)
    .put('/activity/:id', 
        authAdmin,
        updateActivity)
    .delete('/activity/:id', 
        // AUTH: isAdmin
        deleteActivity);

export default activityRouter;
