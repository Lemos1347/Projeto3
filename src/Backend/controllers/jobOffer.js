const jobOfferService = require('../services/jobOffer')
require('express-async-errors')

const createJobOffer = ( req, res ) => {
    //Pega as infos da requisição
    const { name, type, local, description, requirements, skills, name_company, id_company } = req.body;

    //Instancia a classe criando uma vaga
    const offer = new jobOfferService.jobOffer(name, type, local, description, requirements, skills, name_company, id_company);

    //Tratamento das respostas do método da classe
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
    //Pega as infos da requisição
    const { id } = req.body;

    //Instancia a classe criando uma vaga
    const offer = new jobOfferService.jobOffer()

    //Tratamento das respostas do método da classe
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
    //Instancia a classe criando uma vaga
    const offer = new jobOfferService.jobOffer()

    //Tratamento das respostas do método da classe
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

const getOffer = (req, res) => {
    //Pega as infos da requisição
    const {user_id} = req

    //Instancia a classe criando uma vaga
    const offer = new jobOfferService.jobOffer()

    //Tratamento das respostas do método da classe
    offer.getOffer(user_id).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
                offers: resul.vagas
            })
        }
    });
}

const offerExpanded = (req, res) => {
    //Pega as infos da requisição
    const { id } = req.body

    //Instancia a classe criando uma vaga
    const offer = new jobOfferService.jobOffer()

    //Tratamento das respostas do método da classe
    offer.offerExpanded(id).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
                offer: resul.offer
            })
        }
    });
}

const applyOffer = (req, res) => {
    //Pega as infos da requisição
    const {user_id} = req

    //Pega as infos da requisição
    const { idVaga } = req.body;

    //Instancia a classe criando uma vaga
    const offer = new jobOfferService.jobOffer()

    //Tratamento das respostas do método da classe
    offer.applyOffer(user_id, idVaga).then((resul) => {
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

const removeApply = (req, res) => {
    //Pega as infos da requisição
    const {user_id} = req

    //Pega as infos da requisição
    const { idVaga } = req.body;

    //Instancia a classe criando uma vaga
    const offer = new jobOfferService.jobOffer()

    //Tratamento das respostas do método da classe
    offer.removeApply(user_id, idVaga).then((resul) => {
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

const verifyApply = (req, res) => {
    //Pega as infos da requisição
    const {user_id} = req

    //Pega as infos da requisição
    const { idVaga } = req.body;

    //Instancia a classe criando uma vaga
    const offer = new jobOfferService.jobOffer()

    //Tratamento das respostas do método da classe
    offer.verifyApply(user_id, idVaga).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
                message: resul.message,
                applied: resul.applied
            })
        }
    });
}

//Exporta as funções do controller para o ROUTER
module.exports = {
    createJobOffer, deleteOffer, getOffers, getOffer, applyOffer, offerExpanded, removeApply, verifyApply
}