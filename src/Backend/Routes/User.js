const express = require('express');
const router = express.Router();

const userController = require('../controllers/User')

router.post('/Register', userController.createUser)

module.exports = router