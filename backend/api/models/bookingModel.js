const mongoose = require("mongoose");

const BookingSchema = new mongoose.Schema({
    resourceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "resource",
    },

    date: {
        type: Date,
        required: true,
    },

    startingTime: {
        type: Date,
        required: true,
    },

    endingTime: {
        type: Date,
        required: true,
    },

    sessionName: {
        type: String,
        required: true,
    },

    venue: {
        type: String,
        required: true,
    },
});

module.exports = mongoose.model("booking", BookingSchema);
