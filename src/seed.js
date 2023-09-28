/** EXTERNE DEPENDENCIES */import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import mongoose from 'mongoose';

mongoose    
    .connect(`${process.env.DB_URL}/${process.env.DB_NAME}`)
    .then(() => console.log('Connected to database'))
    .catch((err) => console.log('Connection failed', err.message));

import Activity from './models/Activity.js';

const generateActivities = async(name, date, time, location, about, category) => {
    try {
        // const activity = [];s
    let activities = [];

    const activity = new Activity({
        name,
        date,
        time,
        location,
        about,
        category
    });

    activities.push(activity);
    console.log(activity);
    await activity.save();

    } catch(err) {
        console.log(err);
    }

    mongoose.connection.close();
}

generateActivities(
    'YogaFlow',
    'Montag',
    '17:00 - 18:00',
    'Happy Yoga',
    `In your world you can create anything you desire. We'll put all the little clouds in and let them dance around and have fun. A beautiful little sunset. Remember how free clouds are. They just lay around in the sky all day long. We'll do another happy little painting.`,
    'Yoga'
);
generateActivities(
    'AquaGym',
    'Montag',
    '10:00 - 11:00',
    'FitnessIn',
    `There comes a nice little fluffer. In your world you can create anything you desire. There's nothing wrong with having a tree as a friend.`,
    'Fitness'
);
generateActivities(
    'Yin Yoga',
    'Dienstag',
    '19:00 - 20:00',
    'YogaLove',
    `In this world, everything can be happy. There comes a nice little fluffer. You better get your coat out, this is going to be a cold painting. You have freedom here. The only guide is your heart.`,
    'Yoga'
);
generateActivities(
    'pumpIt',
    'Mittwoch',
    '16:30 - 17:30',
    'FitnessIn',
    `You create the dream - then you bring it into your world. We'll throw some happy little limbs on this tree. What the devil.`,
    'Fitness'
);
generateActivities(
    'rückenFit',
    'Freitag',
    '11:00 - 12:00',
    'FitnessIn',
    `You can do anything here. So don't worry about it. We have a fantastic little sky! Nature is so fantastic, enjoy it. Let it make you happy. Follow the lay of the land. It's most important.`,
    'Fitness'
);
generateActivities(
    'Spinning',
    'Samstag',
    '14:00 - 14:45',
    'FitnessIn',
    `Trees grow in all kinds of ways. They're not all perfectly straight. Not every limb is perfect. Work that paint.`,
    'Indoorcycling'
);
generateActivities(
    'BodyPump',
    'Montag',
    '19:00 - 20:00',
    'SportsPlace',
    `We'll throw some happy little limbs on this tree. You don't have to be crazy to do this but it does help. Now let's put some happy little clouds in here.`,
    'Fitness'
);

