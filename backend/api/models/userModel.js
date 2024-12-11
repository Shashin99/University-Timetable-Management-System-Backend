const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },

    firstname: {
        type: String,
        required: true,
    },

    lastname: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        required: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
    },

    role: {
        type: String,
        enum: ["admin", "faculty", "student"],
        required: true,
    },

    enrolledCourses: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: "course",
        default: [],
    },

    createdAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("user", userSchema);
