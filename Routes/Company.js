const express = require('express');
const router = express.Router();
const { body, validationResult } = require("express-validator");

//Importações necessárias
const companyController = require('../controllers/Company')
const userAuth = require('../Middlewares/unsureAuthenticated')
const adminAuth = require('../Middlewares/unsureAdmin')

//ROUTAS com seus respectivos controlers e middlewares
router.post('/Register', 
[
    body('name', 'Nome é necessário').exists({checkFalsy: true}),
    body('email', 'Email é necessário').exists({checkFalsy: true}), 
    body('password', 'Senha é necessária').exists({checkFalsy: true}),
    body('cnpj', 'CNPJ é necessário').exists({checkFalsy: true}),
    body('phoneNumber', 'Número de telefone é necessário').exists({checkFalsy: true}),
],
companyController.createCompany)

router.post('/SendNotify', userAuth.unsureAuthenticated, companyController.sendNotification)

router.put('/Update', userAuth.unsureAuthenticated, companyController.updateCompany)

router.delete('/Delete', userAuth.unsureAuthenticated, companyController.deleteCompany)

router.get('/Companies', userAuth.unsureAuthenticated, companyController.getCompanies)

// router.post('/VerifyAccount', 
// [body('token', 'Código é necessário').exists({checkFalsy: true})], companyController.verifyAccount)

router.get('/VerifyCode', userAuth.unsureAuthenticated, companyController.verifyCode)

router.get('/', userAuth.unsureAuthenticated, companyController.getCompany)

//Exporta o ROUTER
module.exports = router