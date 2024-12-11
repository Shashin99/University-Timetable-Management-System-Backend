const express = require("express");
const connection = require("./configuration/dbconn");
const morgan = require("morgan");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();

const app = express();
app.use(morgan("common"));

connection();

app.use(express.json());

app.use(
    cors({
        origin: ["*"],
        methods: ["POST", "GET", "PATCH", "PUT", "UPDATE", "DELETE"],
        credentials: true,
    })
);

app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));


app.use("/api/users", require("./api/routes/authRoute"));

app.use("/api/courses", require("./api/routes/courseRoute"));

app.use("/api/timetables", require("./api/routes/timetableRoute"));

app.use("/api/resources", require("./api/routes/resourceRoute"));

app.use("/api/enroll", require("./api/routes/enrollCourseRoute"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
