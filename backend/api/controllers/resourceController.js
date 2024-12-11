const Resource = require("../models/resourceModel");
const Booking = require("../models/bookingModel");

const createResource = async (req, res) => {
    try {
        const { resourceInfo } = req.body;
        const newResource = await Resource.create(resourceInfo);
        if (newResource) {
            res.status(200).json({
                status: "Success",
                message: "New Resource Created Successfully",
                resourceInfo: newResource,
                error: null,
            });
        } else {
            res.status(500).json({
                status: "Fail",
                message: "Unabale to create resource",
                resourceInfo: null,
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            resourceInfo: null,
            error: `${error} : ${error.message}`,
        });
    }
};

const getAllResources = async (req, res) => {
    try {
        const resources = await Resource.find({});
        if (resources) {
            res.status(200).json({
                status: "Success",
                message: "Resources fetched successfully",
                resourceInfo: resources,
                error: null,
            });
        } else {
            res.status(404).json({
                status: "Fail",
                message: "Resources not found",
                resourceInfo: resources,
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            resourceInfo: null,
            error: `${error} : ${error.message}`,
        });
    }
};

const getResourceById = async (req, res) => {
    try {
        const { id } = req.params;
        if (id?.length === 24) {
            const resource = await Resource.findById(id);
            if (resource) {
                res.status(200).json({
                    status: "Success",
                    message: "Resource fetched successfully",
                    resourceInfo: resource,
                    error: null,
                });
            } else {
                res.status(404).json({
                    status: "Fail",
                    message: "Resources not found",
                    resourceInfo: null,
                });
            }
        } else {
            res.status(400).json({
                status: "Fail",
                message: "Resources not found",
                resourceInfo: null,
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            resourceInfo: null,
            error: `${error} : ${error.message}`,
        });
    }
};

const updateResource = async (req, res) => {
    try {
        const { id } = req.params;
        const { resourceInfo } = req.body;
        if (id?.length === 24) {
            const resource = await Resource.findById(id);

            if (resource) {
                resource.resourceType = resourceInfo.resourceType;
                resource.name = resourceInfo.name;
                await resource.save();
                res.status(200).json({
                    status: "Success",
                    message: "Resource updated successfully",
                    resourceInfo: resource,
                    error: null,
                });
            } else {
                res.status(404).json({
                    status: "Fail",
                    message: "Resources not found",
                    resourceInfo: null,
                    error: "Resource not found in the database",
                });
            }
        } else {
            res.status(400).json({
                status: "Fail",
                message: "Resources not found",
                resourceInfo: null,
                error: "Resource not found: invalid object id",
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            resourceInfo: null,
            error: `${error} : ${error.message}`,
        });
    }
};

const deleteResource = async (req, res) => {
    try {
        const { id } = req.params;
        if (id?.length === 24) {
            const resource = await Resource.findByIdAndDelete(id);
            if (resource) {
                res.status(200).json({
                    status: "Success",
                    message: "Resource deleted successfully",
                    resourceInfo: resource,
                    error: null,
                });
            } else {
                res.status(404).json({
                    status: "Fail",
                    message: "Resources not found",
                    resourceInfo: null,
                    error: "Resource not found in the database",
                });
            }
        } else {
            res.status(400).json({
                status: "Fail",
                message: "Resources not found",
                resourceInfo: null,
                error: "Resource not found: invalid object id",
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            resourceInfo: null,
            error: `${error} : ${error.message}`,
        });
    }
};

const addBookingToResource = async (req, res) => {
    try {
        const { id } = req.params;
        const { bookingInfo } = req.body;

        if (id?.length === 24) {
            bookingInfo["resourceId"] = id;

            bookingInfo.date = new Date(
                new Date(`${bookingInfo.date}T00:00:00`).getTime() + 60000 * 330
            );
            bookingInfo.startingTime = new Date(
                new Date(`1970-01-01T${bookingInfo.startingTime}`).getTime() +
                    60000 * 330
            );
            bookingInfo.endingTime = new Date(
                new Date(`1970-01-01T${bookingInfo.endingTime}`).getTime() +
                    60000 * 330
            );

            //checking the availability of resource at the same date and time slot
            const alreadyHavebooking = await Booking.findOne({
                $and: [
                    { resourceId: bookingInfo.resourceId },
                    { date: bookingInfo.date },
                    {
                        $or: [
                            {
                                $and: [
                                    {
                                        startingTime: {
                                            $gte: bookingInfo.startingTime,
                                        },
                                    },
                                    {
                                        endingTime: {
                                            $gt: bookingInfo.endingTime,
                                        },
                                    },
                                ],
                            },
                            {
                                $and: [
                                    {
                                        startingTime: {
                                            $lte: bookingInfo.startingTime,
                                        },
                                    },
                                    {
                                        endingTime: {
                                            $lt: bookingInfo.endingTime,
                                        },
                                    },
                                ],
                            },
                            {
                                $and: [
                                    {
                                        startingTime: {
                                            $lte: bookingInfo.startingTime,
                                        },
                                    },
                                    {
                                        endingTime: {
                                            $gte: bookingInfo.endingTime,
                                        },
                                    },
                                ],
                            },
                            {
                                $and: [
                                    {
                                        startingTime: {
                                            $gte: bookingInfo.startingTime,
                                        },
                                    },
                                    {
                                        endingTime: {
                                            $lte: bookingInfo.endingTime,
                                        },
                                    },
                                ],
                            },
                        ],
                    },
                ],
            });

            if (alreadyHavebooking) {
                res.status(400).json({
                    status: "Fail",
                    message:
                        "Booking unable to placed, resource already booked for the same time slot",
                    bookingInfo: null,
                    error: "Booking unable to placed",
                });
            } else {
                const newBooking = await Booking.create(bookingInfo);
                if (newBooking) {
                    res.status(200).json({
                        status: "Success",
                        message: "New booking placed successfully",
                        bookingInfo: newBooking,
                        error: null,
                    });
                } else {
                    res.status(400).json({
                        status: "Fail",
                        message: "Booking unable to placed",
                        bookingInfo: null,
                        error: "Booking unable to placed",
                    });
                }
            }
        } else {
            res.status(400).json({
                status: "Fail",
                message: "Resources not found",
                bookingInfo: null,
                error: "resource not found: invalid object id",
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            bookingInfo: null,
            error: `${error} : ${error.message}`,
        });
    }
};
const getBookingById = async (req, res) => {
    try {
        const { id } = req.params;
        if (id?.length === 24) {
            const booking = await Booking.findById(id);
            if (booking) {
                booking.resourceId = await Resource.findById(
                    booking.resourceId
                );
                res.status(200).json({
                    status: "Success",
                    message: "Booking was fetched Successfully",
                    bookingInfo: booking,
                    error: null,
                });
            } else {
                res.status(404).json({
                    status: "Fail",
                    message: "Resources not found",
                    bookingInfo: null,
                    error: "Booking not found in the database",
                });
            }
        } else {
            res.status(400).json({
                status: "Fail",
                message: "Resources not found",
                bookingInfo: null,
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            bookingInfo: null,
            error: `${error} : ${error.message}`,
        });
    }
};

const deleteBooking = async (req, res) => {
    try {
        const { id } = req.params;
        if (id.length === 24) {
            const bookingToBeDeleted = await Booking.findByIdAndDelete(id);
            if (bookingToBeDeleted) {
                res.status(200).json({
                    status: "Success",
                    message: "Booking was deleted successfully",
                    bookingInfo: bookingToBeDeleted,
                    error: null,
                });
            } else {
                res.status(404).json({
                    status: "Fail",
                    message: "Booking not found",
                    bookingInfo: null,
                });
            }
        } else {
            res.status(400).json({
                status: "Fail",
                message: "Boooking not found",
                bookingInfo: null,
                error: "booking not found: invalid object id",
            });
        }
    } catch (error) {
        console.log(error, error.message);
        res.status(500).json({
            status: "Fail",
            message: "Internal Server Error",
            bookingInfo: null,
            error: `${error} : ${error.message}`,
        });
    }
};

module.exports = {
    createResource,
    getAllResources,
    getResourceById,
    deleteResource,
    updateResource,
    addBookingToResource,
    getBookingById,
    deleteBooking,
};
