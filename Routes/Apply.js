const express = require('express');
const router = express.Router();
const { body } = require("express-validator");

//Importações necessárias
const applyController = require('../controllers/Apply')
const userAuth = require('../Middlewares/unsureAuthenticated')
const adminAuth = require('../Middlewares/unsureAdmin')

//ROUTAS com seus respectivos controlers e middlewares
router.post('/', 
[
    body('idVaga', 'ID da vaga é necessário').exists({checkFalsy: true}),
    body('idUser', 'ID do usuário é necessário').exists({checkFalsy: true}),
    body('status').custom(value => {
        if (value != "Aprovado" && value != "Reprovado") {
            return Promise.reject('Status Inválido');
        }
        return true
    }),
], userAuth.unsureAuthenticated, applyController.getApply)

router.post('/User', 
[
    body('userID', 'ID do usuário é necessário').exists({checkFalsy: true}),
], userAuth.unsureAuthenticated, applyController.getUser)

router.post('/Status', 
[
    body('idVaga', 'ID da vaga é necessário').exists({checkFalsy: true}),
    body('idUser', 'ID do usuário é necessário').exists({checkFalsy: true}),
], userAuth.unsureAuthenticated, applyController.getStatus)

//Exporta o ROUTER
module.exports = router