const express = require('express');
const controller = require('./user.controller')
const router = express.Router();

router
    .post('/', controller.signUp)
    .post('/login', controller.login)

module.exports = router;