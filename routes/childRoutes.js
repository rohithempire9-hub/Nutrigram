const express = require("express");

const router = express.Router();
router.get("/", async (req, res) => {
    try {
        const children = await Child.find().sort({ createdAt: -1 });

        res.json(children);
    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});
const Child = require("../models/Child");

router.post("/", async (req, res) => {
    try {
        const child = await Child.create(req.body);

        res.status(201).json(child);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});
router.delete("/:id", async (req, res) => {
    try {
        const child = await Child.findByIdAndDelete(req.params.id);

        if (!child) {
            return res.status(404).json({
                message: "Child record not found."
            });
        }

        res.json({
            message: "Child record deleted successfully."
        });
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});
router.put("/:id", async (req, res) => {
    try {
        const child = await Child.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!child) {
            return res.status(404).json({
                message: "Child record not found."
            });
        }

        res.json(child);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});
router.get("/:id", async (req, res) => {
    try {
        const child = await Child.findById(req.params.id);

        if (!child) {
            return res.status(404).json({
                message: "Child record not found."
            });
        }

        res.json(child);
    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});
router.get("/:id/analysis", async (req, res) => {
    try {
        const child = await Child.findById(req.params.id);

        if (!child) {
            return res.status(404).json({
                message: "Child record not found."
            });
        }

        // Convert height from cm to meters
        const heightInMeters = child.height / 100;

        // Calculate BMI
        const bmi = child.weight / (heightInMeters * heightInMeters);

        res.json({
            child: {
                id: child._id,
                name: child.name,
                age: child.age,
                gender: child.gender
            },
            measurements: {
                height: child.height,
                weight: child.weight,
                bmi: Number(bmi.toFixed(2))
            },
            foodIntake: {
                eggsPerWeek: child.eggIntake,
                milkPerWeek: child.milkIntake,
                vegetables: child.vegetableIntake
            }
        });

    } catch (error) {
        res.status(400).json({
            message: error.message
        });
    }
});
module.exports = router;
