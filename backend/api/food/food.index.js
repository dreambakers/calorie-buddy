const express = require('express');
const controller = require('./food.controller')
const router = express.Router();

router
    .get('/', controller.getFoods)
    .post('/', controller.addFood)
    .post('/find', controller.findFoods)

module.exports = router;