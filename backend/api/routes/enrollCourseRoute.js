const express = require("express");
const router = express.Router();
const { isStudent, isAdmin } = require("../../middleware/authMiddleware");
const {
    enrollCourse,
    viewTimeTablesOfEnrolledCourses,
    viewEnrolledStudents,
} = require("../controllers/enrollCourseController");

router.post("/create/:courseId", isStudent, enrollCourse);

router.get("/timetables", isStudent, viewTimeTablesOfEnrolledCourses);

router.get("/:courseId", isAdmin, viewEnrolledStudents);

module.exports = router;
