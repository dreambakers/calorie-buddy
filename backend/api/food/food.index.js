const express = require('express');
const controller = require('./food.controller')
const router = express.Router();
const { authenticate } = require('../../middleware/authenticate');

router
    .post('/', authenticate, controller.addFood)

module.exports = router;