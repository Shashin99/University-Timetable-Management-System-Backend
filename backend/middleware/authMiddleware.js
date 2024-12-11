const jwt = require("jsonwebtoken");
const User = require("../api/models/userModel");

const isAdmin = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
                if (err) {
                    return res.status(401).json({ message: "Unauthorized!" });
                } else {
                    const user = await User.findById(data.id);
                    if (user?.role === "admin") {
                        next();
                    } else {
                        return res
                            .status(401)
                            .json({ message: "Unauthorized!" });
                    }
                }
            });
        } else {
            return res.status(401).json({ message: "Unauthorized!" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized!" });
    }
};

const isFaculty = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        console.log(token);
        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
                if (err) {
                    return res.status(401).json({ message: "Unauthorized!" });
                } else {
                    console.log(data);
                    const user = await User.findById(data.id);
                    console.log(user);
                    if (user?.role === "faculty") {
                        next();
                    } else {
                        return res
                            .status(401)
                            .json({ message: "Unauthorized!" });
                    }
                }
            });
        } else {
            return res.status(401).json({ message: "Unauthorized!" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized!" });
    }
};

const isStudent = (req, res, next) => {
    try {
        const token = req.header("Authorization");
        if (token) {
            jwt.verify(token, process.env.TOKEN_KEY, async (err, data) => {
                if (err) {
                    return res.status(401).json({ message: "Unauthorized!" });
                } else {
                    const user = await User.findById(data.id);
                    if (user?.role === "student") {
                        next();
                    } else {
                        return res
                            .status(401)
                            .json({ message: "Unauthorized!" });
                    }
                }
            });
        } else {
            return res.status(401).json({ message: "Unauthorized!" });
        }
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized!" });
    }
};

module.exports = {
    isAdmin,
    isFaculty,
    isStudent,
};
