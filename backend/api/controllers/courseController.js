const Course = require("../models/courseModel");

const createCourse = async (req, res) => {
    try {
        const { courseInfo } = req.body;
        console.log(courseInfo);
        const newCourse = await Course.create(courseInfo);
        if (newCourse) {
            res.status(200).json({
                status: "Success",
                message: "Course created successfully",
                courseInfo: newCourse,
                error: null,
            });
        } else {
            console.log("Error Occured During Course Creation");
            res.status(500).json({
                status: "Fail",
                message: "Internal Server Error",
                courseInfo: null,
                error: "Error Occured During Course Creation",
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            courseInfo: null,
            error: error.message,
        });
    }
};

const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find({});
        res.status(200).json({
            status: "Success",
            message: "Courses fetched successfully",
            courseInfo: courses,
            error: null,
        });
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            courseInfo: null,
            error: error.message,
        });
    }
};

const updateCourse = async (req, res) => {
    try {
        const { courseInfo } = req.body;
        const { id } = req.params;
        const course = await Course.findById(id);

        if (course) {
            course.course_code = courseInfo.course_code;
            course.course_name = courseInfo.course_name;
            course.description = courseInfo.description;
            course.credits = courseInfo.credits;
            await course.save();

            res.status(200).json({
                status: "Success",
                message: "Course updated successfully",
                courseInfo: course,
                error: null,
            });
        } else {
            res.status(404).json({
                status: "Fail",
                message: "Course not found",
                courseInfo: null,
                error: "Course not found in the database",
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            courseInfo: null,
            error: error.message,
        });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const { id } = req.params;
        const course = await Course.findOneAndDelete({ _id: id });
        if (course) {
            res.status(404).json({
                status: "Success",
                message: "Course deleted successfully",
                courseInfo: course,
                error: null,
            });
        } else {
            res.status(404).json({
                status: "Fail",
                message: "Course not found",
                courseInfo: null,
                error: "Course not found in the database",
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            courseInfo: null,
            error: error.message,
        });
    }
};

// New function to assign faculties to a course
const assignFaculties = async (req, res) => {
    try {
        const { id } = req.params;
        const { faculties } = req.body;
        let facsToBeAdded = [...faculties];

        const course = await Course.findById(id);
        if (course) {
            for (let currentFac of course.faculty) {
                for (let inputFac of faculties) {
                    if (
                        currentFac.trim().toLowerCase() ==
                        inputFac.trim().toLowerCase()
                    ) {
                        facsToBeAdded = facsToBeAdded.filter(
                            (fac) =>
                                fac.trim().toLowerCase() !==
                                currentFac.trim().toLowerCase()
                        );
                        break;
                    }
                }
            }

            console.log(facsToBeAdded);
            course.faculty.push(...facsToBeAdded);

            console.log(course);
            await course.save();

            res.status(200).json({
                status: "Success",
                message: "Faculties assigned to the course Successfully",
                courseInfo: course,
                error: null,
            });
        } else {
            res.status(404).json({
                status: "Fail",
                message: "course not found",
                courseInfo: null,
                error: "Course not found in the database",
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            courseInfo: null,
            error: error.message,
        });
    }
};

module.exports = {
    createCourse,
    getAllCourses,
    updateCourse,
    deleteCourse,
    assignFaculties,
};
