require("dotenv").config();

const mongoose = require("mongoose");
const express = require("express");
const path = require("path");

const childRoutes = require("./routes/childRoutes");

const app = express();

app.use(express.json());
app.use("/api/children", childRoutes);

app.use(express.static(path.join(__dirname, "public")));

const PORT = 3000;
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB connected");

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error.message);
    });