const express = require("express");
const router = express.Router();

const { isFaculty } = require("../../middleware/authMiddleware");

const {
    createResource,
    getAllResources,
    getResourceById,
    deleteResource,
    updateResource,
    addBookingToResource,
    getBookingById,
    deleteBooking,
} = require("../controllers/resourceController");

router.post("/create", isFaculty, createResource);

router.get("/", isFaculty, getAllResources);

router.get("/resource/:id", isFaculty, getResourceById);

router.put("/update/:id", isFaculty, updateResource);

router.delete("/delete/:id", isFaculty, deleteResource);

router.post("/resource/:id/booking", isFaculty, addBookingToResource);

router.get("/resource/booking/:id", isFaculty, getBookingById);

router.delete("/resource/booking/delete/:id", isFaculty, deleteBooking);

module.exports = router;
