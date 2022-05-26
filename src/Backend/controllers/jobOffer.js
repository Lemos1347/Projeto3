const jobOfferService = require('../services/jobOffer')
require('express-async-errors')

const createJobOffer = ( req, res ) => {
    const { name, type, local, description, requirements, skills, name_company, id_company } = req.body;

    const offer = new jobOfferService.jobOffer(name, type, local, description, requirements, skills, name_company, id_company);

    offer.createOffer().then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
                message: resul.message
            })
        }
    });
}

const deleteOffer = (req, res) => {
    const { id } = req.body;

    const offer = new jobOfferService.jobOffer()

    offer.deleteOffer(id).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
                message: resul.message
            })
        }
    });
}

const getOffers = (req, res) => {
    const offer = new jobOfferService.jobOffer()

    offer.getOffers().then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
                offers: resul.offers
            })
        }
    });
}

module.exports = {
    createJobOffer, deleteOffer, getOffers
}