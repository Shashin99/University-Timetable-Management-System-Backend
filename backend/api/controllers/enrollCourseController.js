const User = require("../models/userModel");
const Course = require("../models/courseModel");
const TimeTable = require("../models/timetableModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const enrollCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const token = req.header("Authorization");

        if (courseId?.length === 24) {
            jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
                if (err) {
                    res.status(500).json({
                        status: "Fail",
                        message: "Student profile not found",
                        courseInfo: null,
                        error: "error occured fetching student profile",
                    });
                } else {
                    const user = await User.findById(data.id);
                    if (user) {
                        const course = await Course.findById(courseId);
                        if (course) {
                            if (
                                user.enrolledCourses.includes(
                                    new mongoose.Types.ObjectId(course._id)
                                )
                            ) {
                                user.enrolledCourses =
                                    user.enrolledCourses.filter((cid) => {
                                        if (
                                            cid.toString() !==
                                            course._id.toString()
                                        ) {
                                            return cid;
                                        }
                                    });
                                await user.save();
                                res.status(200).json({
                                    status: "Success",
                                    message: "Already enrolled in the course",
                                    courseInfo: course,
                                    error: null,
                                });
                            } else {
                                user.enrolledCourses.push(course._id);
                                await user.save();
                                res.status(200).json({
                                    status: "Success",
                                    message:
                                        "Successfully enrolled in the course",
                                    courseInfo: course,
                                    error: null,
                                });
                            }
                        } else {
                            res.status(400).json({
                                status: "Fail",
                                message: "Course not found",
                                courseInfo: null,
                                error: "Course not found in the database",
                            });
                        }
                    } else {
                        res.status(404).json({
                            status: "Fail",
                            message: "Student profile not found",
                            courseInfo: null,
                            error: "Student profile not found in the database",
                        });
                    }
                }
            });
        } else {
            res.status(400).json({
                status: "Fail",
                message: "Course not found",
                courseInfo: null,
                error: "course not found: invalid object id",
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            courseInfo: null,
            error: `${error} : ${error.message}`,
        });
    }
};

const viewTimeTablesOfEnrolledCourses = async (req, res) => {
    try {
        const token = req.header("Authorization");
        jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
            if (err) {
                res.status(500).json({
                    status: "Fail",
                    message: "Student timetables not found",
                    enrolledTimetables: null,
                    error: "Error occured fetching student timetables",
                });
            } else {
                const user = await User.findById(data.id);
                if (user) {
                    let weeklyTimetables = [];
                    for (const cid of user.enrolledCourses) {
                        const course = await Course.findById(cid);
                        const weeklyTimeTable = await TimeTable.findById(
                            course?.weeklyTimeTable
                        );
                        if (weeklyTimeTable) {
                            weeklyTimetables.push(weeklyTimeTable);
                        }
                    }
                    res.status(200).json({
                        status: "Success",
                        message: "weeklyTimeTable of enrolled modules",
                        enrolledTimetables: weeklyTimetables,
                        error: null,
                    });
                } else {
                    res.status(404).json({
                        status: "Fail",
                        message: "Student profile not found",
                        enrolledTimetables: null,
                        error: "Student profile not found in the database",
                    });
                }
            }
        });
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            enrolledTimetables: null,
            error: `${error} : ${error.message}`,
        });
    }
};

const viewEnrolledStudents = async (req, res) => {
    try {
        const { courseId } = req.params;
        if (courseId.length === 24) {
            const students = await User.find({
                enrolledCourses: new mongoose.Types.ObjectId(courseId),
            });
            // console.log(students);
            res.status(200).json({
                status: "Success",
                message: "Enrolled students fetched successfully",
                enrolledStudents: students,
                error: null,
            });
        } else {
            res.status(400).json({
                status: "Fail",
                message: "Enrolled students not found",
                enrolledStudents: null,
                error: "Enrolled students not found",
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            enrolledStudents: null,
            error: `${error} : ${error.message}`,
        });
    }
};

module.exports = {
    enrollCourse,
    viewTimeTablesOfEnrolledCourses,
    viewEnrolledStudents,
};
