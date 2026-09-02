const mongoose = require("mongoose");

const childSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
},

age: {
    type: Number,
    required: true,
    min: 1,
    max: 18
},

height: {
    type: Number,
    required: true,
    min: 1
},

weight: {
    type: Number,
    required: true,
    min: 1
},

gender: {
    type: String,
    required: true,
    enum: ["male", "female"]        
},
eggIntake: {
    type: Number,
    required: true,
    min: 0
},
milkIntake: {
    type: String,
    required: true,
    enum: ["1-2 times", "3-4 times", "5-6 times", "7 or more times"]
},
vegetableIntake: {
    type: String,   
    required: true,
    enum: ["3-4 times a week", "1-2 times a week", "rarely"]
}},
{
     timestamps: true
});
const Child = mongoose.model("Child", childSchema);
module.exports = Child;