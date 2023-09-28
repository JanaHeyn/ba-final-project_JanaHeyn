/** IMPORTS */
import Activity from '../models/Activity.js';
import User from '../models/User.js';

export const createActivity = async(req, res, next) => {
    try {
        const { name, date, time, location, category, about } = req.body;

        // auth einfügen!

        const newActivity = new Activity({
            name,
            date,
            time,
            location,
            category,
            about
        });

        await newActivity.save();
        res.status(201).json({
            success: true,
            message: 'You created a new activity!'
        });

    } catch(err) {
        next(err);
    }
}

export const getActivity = async(req, res, next) => {
    try {
        const { id } = req.params;

        const activity = await Activity.findById(id);
        res.status(200).json({
            success: true,
            data: activity
        });

    } catch(err) {
        next(err);
    }
}


export const getAllActivities = async(req, res, next) => {
    try {

        const activities = await Activity.find({});
        const responseMessage = activities.length === 0
        ?
        'Sorry, seems the database is empty.'
        : 'Here you can see all activities:';

        res.status(200).json({
            success: true,
            message: responseMessage,
            amount: activities.length,
            data: activities
        });

    } catch(err) {
        next(err);
    }
}


export const getActivitiesByCategory = async(req, res, next) => {
    try {
        const { category } = req.params;
   
        // console.log('filtered activities', req.params.category);

        const activities = await Activity.find({category: category});
        const responseMessage = activities.length === 0
        ?
        'Sorry, seems the database is empty.'
        : `Here are ${activities.length} activities from the category ${category}:`;

        res.status(200).json({
            success: true,
            message: responseMessage,
            amount: activities.length,
            data: activities
        })

    } catch(err) {
        next(err);
    }
}

export const getActivitiesByDate = async(req, res, next) => {
    try {
        const { date } = req.params;
   
        console.log('filtered activities', req.params.date);

        const activities = await Activity.find({date: date});
        const responseMessage = date.length === 0
        ?
        'Sorry, seems the database is empty.'
        : `Here are ${activities.length} activities on ${date}:`;

        res.status(200).json({
            success: true,
            message: responseMessage,
            amount: activities.length,
            data: activities
        })

    } catch(err) {
        next(err);
    }
}

export const getActivitiesByLocation = async(req, res, next) => {
    try {
        const { location } = req.params;

        const activities = await Activity.find({location: location});
        const responseMessage = activities.length === 0
        ?
        'Sorry, seems the database is empty.'
        : `Here are ${activities.length} activities in ${location}:`;

        res.status(200).json({
            success: true,
            message: responseMessage,
            amount: activities.length,
            data: activities
        })

    } catch(err) {
        next(err);
    }
}

export const updateActivity = async(req, res, next) => {
    try {
        const activityID = req.params.id;
        const updatedActivity = req.body;

        const activity = await Activity.findByIdAndUpdate(activityID, updatedActivity, { new: true });
        res.status(201).json({
            success: true,
            message: 'Activity successfully updated:',
            data: activity
        });

    } catch(err) {
        next(err);
    }
}


export const deleteActivity = async(req, res, next) => {
    try {
        const { id } = req.params;

        const delActivity = await Activity.findByIdAndDelete(id);
        res.status(201).json({
            success: true,
            message: 'You deleted the following activity:',
            data: delActivity
        });

    } catch(err) {
        next(err); 
    }
}


export const deleteAllActivities = async(req, res, next) => {
    try {
        await Activity.deleteMany();
        res.status(201).json({
            success: true,
            message: 'You deleted all activities'
        });

    } catch(err) {
        next(err);
    }
}
