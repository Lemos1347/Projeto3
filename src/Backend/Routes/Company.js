const express = require('express');
const router = express.Router();

const companyController = require('../controllers/Company')
const userAuth = require('../Middlewares/unsureAuthenticated')
const adminAuth = require('../Middlewares/unsureAdmin')

router.post('/Register', companyController.createCompany)
router.put('/Update', userAuth.unsureAuthenticated, companyController.updateCompany)
router.delete('/Delete', userAuth.unsureAuthenticated, companyController.deleteCompany)

module.exports = router