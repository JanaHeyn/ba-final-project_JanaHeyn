/** EXTERNE DEPENDENCIES */
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
    name: String,
    date: String,
    time: String,
    location: String,
    about: String,
    category: String
});

const Activity = new mongoose.model('Activity', activitySchema, 'activities');

export default Activity
