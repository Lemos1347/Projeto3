const express = require('express');
const router = express.Router();

const userController = require('../controllers/User')

router.post('/Register', userController.createUser)
router.post('/Login', userController.AuthUser)
router.put('/Update', userController.UpdateUser)
router.delete('/Delete', userController.deleteUser)

module.exports = router