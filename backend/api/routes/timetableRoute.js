const express = require("express");
const router = express.Router();
const { isFaculty } = require("../../middleware/authMiddleware");
const {
    createTimetable,
    updateTimeTable,
    addClassSession,
    removeClassSession,
    getTimeTables,
    getCourseClassSessionByDay,
} = require("../controllers/timetableController");

router.post("/create", isFaculty, createTimetable);

router.put("/update/:id", isFaculty, updateTimeTable);

router.get("/", isFaculty, getTimeTables);

router.post("/daily/:timeTableId/:day", isFaculty, addClassSession);

router.delete(
    "/daily/:timeTableId/:day/:sessionId",
    isFaculty,
    removeClassSession
);

router.get("/daily/:timeTableId/:day", isFaculty, getCourseClassSessionByDay);

module.exports = router;
