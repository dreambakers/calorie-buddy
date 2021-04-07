const { mongoose } = require('../../db/connection');

const foodSchema = new mongoose.Schema({
    name: String,
    typicalValues: Number,
    typicalValueUnit: String,
    calories: Number,
    carbs: Number,
    fat: Number,
    protien: Number,
    salt: Number,
    sugar: Number,
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, {
    timestamps: true
});

const Food = mongoose.model('Food', foodSchema);
module.exports = {
    Food
};