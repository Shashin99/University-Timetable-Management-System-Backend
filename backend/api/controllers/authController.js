const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

async function register(req, res) {
    const username = req.body.username;
    const firstname = req.body.firstname;
    const lastname = req.body.lastname;
    const email = req.body.email;
    const password = req.body.password;
    const role = req.body.role;

    try {
        let exisitingUser = await User.findOne({ email });

        if (exisitingUser) {
            return res.status(400).json({ message: "User aleady exists" });
        }

        const newUser = new User({
            username,
            firstname,
            lastname,
            email,
            password,
            role,
        });

        await newUser.save();
        res.status(201).json({ message: "User created successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

async function login(req, res) {
    const { username, password } = req.body;

    await User.findOne({ username })
        .then((loguser) => {
            if (!loguser) {
                return res.status(404).send({ status: "User not found" });
            }
            if (password == loguser.password) {
                const userlogtype = loguser.role;
                const loggertype = { id: loguser._id, role: userlogtype };
                const token = jwt.sign(loggertype, process.env.TOKEN_KEY, {
                    expiresIn: "12h",
                });
                loguser.save();
                res.status(200).send({
                    status: "User logged Successfully",
                    token,
                });
            } else {
                res.status(412).send({ status: "User password is incorrect"});
            }
        })
        .catch((error) => {
            console.log(error);
            res.status(500).send({
                status: "Error with logging functionality",
            });
        });
}

module.exports = { register, login };
