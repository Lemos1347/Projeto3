const express = require('express');
const router = express.Router();

const offerController = require('../controllers/jobOffer')
const userAuth = require('../Middlewares/unsureAuthenticated')
const adminAuth = require('../Middlewares/unsureAdmin')
const companyAuth = require('../Middlewares/unsureCompany')

router.post('/Create', userAuth.unsureAuthenticated, companyAuth.ensureCompany, offerController.createJobOffer)
router.post('/Delete', offerController.deleteOffer)
router.get('/Offers', offerController.getOffers)

module.exports = router