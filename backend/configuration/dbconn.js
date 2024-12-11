const mongoose = require("mongoose");
require("dotenv").config();

const connection = async () => {
    try {
        const conn = await mongoose.connect(process.env.DB_URL, {});
        console.log(`MongoDB Connected Successfully`);
        console.log(`MongoDB Host Connected : ${conn.connection.host}`);
    } catch (err) {
        console.log(`Error Connecting to MongoDB: ${err.message}`);
        throw err;
    }
};

module.exports = connection;
