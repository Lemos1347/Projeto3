const express = require('express');
const router = express.Router();

//Importações necessárias
const offerController = require('../controllers/jobOffer')
const userAuth = require('../Middlewares/unsureAuthenticated')
const adminAuth = require('../Middlewares/unsureAdmin')
const companyAuth = require('../Middlewares/unsureCompany')

//ROUTAS com seus respectivos controlers e middlewares
router.post('/Create', userAuth.unsureAuthenticated, companyAuth.ensureCompany, offerController.createJobOffer)
router.post('/Delete', offerController.deleteOffer)
router.get('/getOffers', offerController.getOffers)
router.get('/OfferUser', userAuth.unsureAuthenticated, offerController.getOffer)
router.post('/Apply',userAuth.unsureAuthenticated, offerController.applyOffer)
router.delete('/RemoveApply',userAuth.unsureAuthenticated, offerController.removeApply)
router.post('/VerifyApply',userAuth.unsureAuthenticated, offerController.verifyApply)
router.post('/offerExpanded',userAuth.unsureAuthenticated, offerController.offerExpanded)

//Exporta o ROUTER
module.exports = router