const mongoose = require("mongoose");

const courseSchedule = new mongoose.Schema({
    classSession: {
        type: String,
        required: true,
    },

    time: {
        type: String,
        require: true,
    },

    faculty: {
        type: String,
        required: true,
    },

    location: {
        type: String,
        required: true,
    },
});

const timetableSchema = new mongoose.Schema({
    course_code: {
        type: String,
        required: true,
        unique: true,
    },

    monday: {
        type: [courseSchedule],
        default: [],
    },

    tuesday: {
        type: [courseSchedule],
        default: [],
    },

    wednesday: {
        type: [courseSchedule],
        default: [],
    },

    thursday: {
        type: [courseSchedule],
        default: [],
    },

    friday: {
        type: [courseSchedule],
        default: [],
    },

    saturday: {
        type: [courseSchedule],
        default: [],
    },

    sunday: {
        type: [courseSchedule],
        default: [],
    },
});

module.exports = mongoose.model("timetable", timetableSchema);
