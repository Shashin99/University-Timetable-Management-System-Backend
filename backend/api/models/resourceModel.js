const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
    resourceType: {
        type: String,
        required: true,
    },

    name: {
        type: String,
        required: true,
        unique: true,
    },
});

module.exports = mongoose.model("resource", ResourceSchema);
