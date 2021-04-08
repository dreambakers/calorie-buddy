const { Food } = require('./food.model');

const addFood = async (req, res) => {
    try {
        // create new food document from request body
        let newFood = new Food({
            ...req.body
        });
        // save the food
        newFood = await newFood.save();
        if (newFood) {
            // return food object to front end
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
        // get all food from database
        const foods = await Food.find();
        // return as JSON array to front-end
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

const findFoods = async (req, res) => {
    try {
        // Here we search through regex on the food name so that we can pick the document if it contains the search term anywhere
        // i flag is for case insensitivity
        const foods = await Food.find({ "name" : { $regex: req.body.searchTerm, $options: 'i' } });
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
    getFoods,
    findFoods
}