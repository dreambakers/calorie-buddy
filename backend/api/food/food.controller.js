const { Food } = require('./food.model');

const addFood = async (req, res) => {
    try {
        let newFood = new Food({
            ...req.body
        });
        newFood = await newFood.save();
        if (newFood) {
            return res.json({
                success: 1,
                newFood
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(400).send({
            success: 0
        });
    }
}

const getFoods = async (req, res) => {
    try {
        const foods = await Food.find();
        return res.json({
            success: 1,
            foods
        });
    }
    catch (error) {
        console.log(error);
        res.status(400).send({
            success: 0
        });
    }
}

module.exports = {
    addFood,
    getFoods
}