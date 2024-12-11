const express = require("express");
const { isAdmin, isFaculty } = require("../../middleware/authMiddleware");
const {
    createCourse,
    getAllCourses,
    updateCourse,
    deleteCourse,
    assignFaculties,
} = require("../controllers/courseController");
const router = express.Router();

router.post("/create", isFaculty, createCourse);

router.get("/", isFaculty, getAllCourses);

router.put("/update/:id", isFaculty, updateCourse);

router.delete("/delete/:id", isFaculty, deleteCourse);

//authorized only for isAdmin
router.patch("/course/:id", isAdmin, assignFaculties);

module.exports = router;
