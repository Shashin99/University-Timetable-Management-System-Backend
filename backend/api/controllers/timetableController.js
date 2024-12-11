const Course = require("../models/courseModel");
const User = require("../models/userModel");
const TimeTable = require("../models/timetableModel");
const { sendNotificationAlert } = require("../../utils/notification");
const mongoose = require("mongoose");

const createTimetable = async (req, res) => {
    try {
        const { timetableInfo } = req.body;
        timetableInfo.course_code;
        const relCourse = await Course.findOne({
            course_code: {
                $regex: new RegExp("^" + timetableInfo.course_code + "$", "i"),
            },
        });
        if (relCourse) {
            //map time value with a Date object
            for (const key in timetableInfo) {
                if (key !== "course_code") {
                    for (let item of timetableInfo[key]) {
                        item.time = new Date(
                            "1970-01-01T" + item.time
                        ).toTimeString();
                    }
                }
            }

            const storedTimeTable = await TimeTable.create(timetableInfo);

            if (storedTimeTable) {
                relCourse.timetable = storedTimeTable._id;
                await relCourse.save();

                res.status(200).json({
                    status: "Success",
                    message: "Time Table Created Successfully",
                    timetableInfo: storedTimeTable,
                    error: null,
                });
            }
        } else {
            res.status(500).json({
                status: "Fail",
                message: "Internal server error, unable to create timetable",
                timetableInfo: null,
                error: "Course not found with the given course code",
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "internal Server Error",
            timetableInfo: null,
            error: error.message,
        });
    }
};

const updateTimeTable = async (req, res) => {
    try {
        const { timetableInfo } = req.body;
        const { id } = req.params;

        if (id?.length === 24) {
            const currentTimeTable = await TimeTable.findOne({ _id: id });

            if (currentTimeTable) {
                for (const key in timetableInfo) {
                    if (key !== "course_code") {
                        for (let item of timetableInfo[key]) {
                            if (!item.time?.includes("India Standard Time")) {
                                item.time = new Date(
                                    "1970-01-01T" + item.time
                                ).toTimeString();
                            }
                        }
                    }
                }

                currentTimeTable.monday = timetableInfo.monday
                    ? timetableInfo.monday
                    : [];

                currentTimeTable.tuesday = timetableInfo.tuesday
                    ? timetableInfo.tuesday
                    : [];

                currentTimeTable.wednesday = timetableInfo.wednesday
                    ? timetableInfo.wednesday
                    : [];

                currentTimeTable.thursday = timetableInfo.thursday
                    ? timetableInfo.thursday
                    : [];

                currentTimeTable.friday = timetableInfo.friday
                    ? timetableInfo.friday
                    : [];

                currentTimeTable.saturday = timetableInfo.saturday
                    ? timetableInfo.saturday
                    : [];

                currentTimeTable.sunday = timetableInfo.sunday
                    ? timetableInfo.sunday
                    : [];

                await currentTimeTable.save();

                res.status(200).json({
                    status: "Success",
                    message: "Time Table Updated Successfully",
                    timetableInfo: currentTimeTable,
                    error: null,
                });
            } else {
                res.status(404).json({
                    status: "Fail",
                    message: "Timetable not Found",
                    timetableInfo: null,
                    error: "Timetable not found with the given id",
                });
            }
        } else {
            res.status(400).json({
                status: "Fail",
                message: "Time Table not Found",
                timetableInfo: null,
                error: "Timetable not found: invalid object id",
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            timetableInfo: null,
            error: error.message,
        });
    }
};

const getTimeTables = async (req, res) => {
    try {
        const TimeTables = await TimeTable.find({});
        if (TimeTables) {
            res.status(200).json({
                status: "Success",
                message: "Time Table fetched Successfully",
                timetableInfo: TimeTables,
                error: null,
            });
        } else {
            res.status(404).json({
                status: "Fail",
                message: "Time table not found",
                timetableInfo: null,
                error: "No timetable found in the database",
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            timetableInfo: null,
            error: error.message,
        });
    }
};

const addClassSession = async (req, res) => {
    try {
        const days = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ];
        const { timeTableId, day } = req.params;
        const { newSchedule } = req.body;

        if (timeTableId?.length === 24 && days?.includes(day?.toLowerCase())) {
            const currentTimeTable = await TimeTable.findById(timeTableId);

            if (currentTimeTable) {
                newSchedule.time = new Date(
                    "1970-01-01T" + newSchedule?.time
                ).toTimeString();
                let dayInLower = day.toLowerCase();

                currentTimeTable[`${dayInLower}`].push(newSchedule);
                await currentTimeTable.save();

                const course = await Course.findOne({
                    course_code: currentTimeTable.course_code,
                });
                const students = await User.find({
                    enrolledCourses: course?._id,
                });

                for (const student of students) {
                    console.log(student);
                    sendNotificationAlert(
                        `New Class Session Added To The Timetable`,
                        `${course.course_name} - ${day}\n${newSchedule.classSession} on ${newSchedule.time} at ${newSchedule.location}`,
                        student.email
                    );
                }

                res.status(200).json({
                    status: "Success",
                    message:
                        "Time Table updated and new class Session added Successfully",
                    timetableInfo: currentTimeTable,
                    error: null,
                });
            } else {
                res.status(404).json({
                    status: "Fail",
                    message: "Time Table not Found",
                    timetableInfo: null,
                    error: "Timetable not found with the given id",
                });
            }
        } else {
            res.status(400).json({
                status: "Fail",
                message: "Time Table not Found",
                timetableInfo: null,
                error:
                    days.includes(day?.toLowerCase()) === true
                        ? "Timetable not found: invalid object id"
                        : "Timetable not found: invalid day",
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            timetableInfo: null,
            error: error.message,
        });
    }
};

const removeClassSession = async (req, res) => {
    try {
        const days = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ];
        const { timeTableId, day, sessionId } = req.params;
        if (timeTableId?.length === 24 && days?.includes(day?.toLowerCase())) {
            const currentTimeTable = await TimeTable.findById(timeTableId);

            if (currentTimeTable) {
                let dayInLower = day.toLowerCase();

                currentTimeTable[`${dayInLower}`] = currentTimeTable[
                    `${dayInLower}`
                ].filter((session) => {
                    if (session._id.toString() !== sessionId) return session;
                });

                await currentTimeTable.save();
                res.status(200).json({
                    status: "Success",
                    message: "Time table updated Succesfully",
                    timetableInfo: currentTimeTable,
                    error: null,
                });
            } else {
                res.status(404).json({
                    status: "Fail",
                    message: "Timetable not found",
                    timetableInfo: null,
                    error: "Timetable not found with the given id",
                });
            }
        } else {
            res.status(400).json({
                status: "Fail",
                message: "Time Table not found",
                timetableInfo: null,
                error:
                    days.includes(day?.toLowerCase()) === true
                        ? "Timetable not found: invalid object id"
                        : "Timetable not found: invalid day",
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            timetableInfo: null,
            error: error.message,
        });
    }
};

const getCourseClassSessionByDay = async (req, res) => {
    try {
        const days = [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
        ];
        const { timeTableId, day } = req.params;

        if (timeTableId?.length === 24 && days?.includes(day?.toLowerCase())) {
            const TimeTables = await TimeTable.findOne({ _id: timeTableId });
            if (TimeTables) {
                let classSessions = TimeTables[`${day?.toLowerCase()}`];
                res.status(200).json({
                    status: "Success",
                    message: `${day?.toLowerCase()} Class Session Fetched Successfully`,
                    timetableInfo: classSessions,
                    error: null,
                });
            } else {
                res.status(404).json({
                    status: "Fail",
                    message: "Time table not found",
                    timetableInfo: null,
                    error: "No timetable found in the database",
                });
            }
        } else {
            res.status(400).json({
                status: "Fail",
                message: "Unable to fetch timetable",
                timetableInfo: null,
                error:
                    days.includes(day?.toLowerCase()) === true
                        ? "Timetable not found: invalid object id"
                        : "Timetable not found: invalid day",
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            timetableInfo: null,
            error: error.message,
        });
    }
};

module.exports = {
    createTimetable,
    updateTimeTable,
    addClassSession,
    removeClassSession,
    getTimeTables,
    getCourseClassSessionByDay,
};
