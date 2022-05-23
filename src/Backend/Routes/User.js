const express = require('express');
const router = express.Router();

const userController = require('../controllers/User')
const userAuth = require('../Middlewares/unsureAuthenticated')
const adminAuth = require('../Middlewares/unsureAdmin')

router.post('/Register', userController.createUser)
router.post('/Login', userController.AuthUser)
router.put('/Update', userAuth.unsureAuthenticated, userController.UpdateUser)
router.delete('/Delete', userAuth.unsureAuthenticated, userController.deleteUser)
router.get('/Verify/Curriculum', userAuth.unsureAuthenticated, userController.verifyCurriculum)
router.put('/Update/Permission', userAuth.unsureAuthenticated, adminAuth.ensureAdmin, userController.updatePermission)

module.exports = router