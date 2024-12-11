const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    course_code: {
        type: String,
        required: true,
        unique: true,
    },

    course_name: {
        type: String,
        required: true,
    },

    description: {
        type: String,
        required: true,
    },

    credits: {
        type: Number,
        required: true,
    },

    faculty: {
        type: [String],
        default: [],
    },

    weeklyTimeTable: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "timetable",
        default: null
    }
});

module.exports = mongoose.model("course", courseSchema);
