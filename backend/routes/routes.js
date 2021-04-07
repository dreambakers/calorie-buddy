const express = require('express');
const router = express.Router();

const user = require("../api/user/user.index");
const food = require("../api/food/food.index");

router
    .use('/user', user)
    .use('/food', food)

module.exports = router;