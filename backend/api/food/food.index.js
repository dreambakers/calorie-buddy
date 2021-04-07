const express = require('express');
const controller = require('./food.controller')
const router = express.Router();
const { authenticate } = require('../../middleware/authenticate');

router
    .get('/', controller.getFoods)
    .post('/', authenticate, controller.addFood)

module.exports = router;