const request = require("supertest");
const app = require("../server");
const User = require("../api/models/userModel");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

let mongoServer;

beforeAll(async () => {
    mongoServer = new MongoMemoryServer();
    const mongoUri = await mongoServer.getUri();
    await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    });
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

describe("Auth Controller", () => {
    describe("POST /register", () => {
        it("should create a new user and return a 201 status code", async () => {
            const userData = {
                username: "Niroshan34",
                firstname: "Niroshan",
                lastname: "Dickwella",
                email: "niroshan@gmail.com",
                password: "12340987",
                role: "admin",
            };

            const res = await request(app).post("/register").send(userData);

            expect(res.statusCode).toEqual(201);
            expect(res.body).toHaveProperty(
                "message",
                "User created successfully"
            );
        });

        it("should return 400 status code when a user already exists", async () => {
            const userData = {
                username: "Shashin99",
                firstname: "Shashin",
                lastname: "Kalpajith",
                email: "shashikalpjith6@gmail.com",
                password: "00000000",
                role: "student",
            };

            // First, create a user
            await request(app).post("/register").send(userData);

            // Then, try to create the same user again
            const res = await request(app).post("/register").send(userData);

            expect(res.statusCode).toEqual(400);
            expect(res.body).toHaveProperty("message", "User already exists");
        });
    });

    describe("POST /login", () => {
        it("should login a user and return a 200 status code", async () => {
            const userData = {
                username: "Shashin99",
                password: "00000000",
            };

            const res = await request(app).post("/login").send(userData);

            expect(res.statusCode).toEqual(200);
            expect(res.body).toHaveProperty(
                "status",
                "User logged Successfully"
            );
        });

        it("should return 412 status code when password is incorrect", async () => {
            const userData = {
                username: "Shashin99",
                password: "11111111",
            };

            const res = await request(app).post("/login").send(userData);

            expect(res.statusCode).toEqual(412);
            expect(res.body).toHaveProperty(
                "status",
                "User password is incorrect"
            );
        });
    });
});

afterEach(async () => {
    // This will ensure that the database is cleaned up after each test run
    await User.deleteMany();
});
