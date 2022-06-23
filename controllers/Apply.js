const applyService = require('../services/Apply')
require('express-async-errors')
const { validationResult } = require("express-validator");

const getApply = (req, res) => {
    //Pega as infos da requisição
    const { idUser, idVaga, status } = req.body

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.errors[0].msg
        })
        return
    }

    //Instancia a classe criando uma vaga
    const apply = new applyService.Apply();

    //Tratamento das respostas do método da classe
    apply.getUserApplied(idVaga, idUser, status).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                message: resul.message
            })
        } else {
            res.status(200).json({
                message: resul.message,
            })
        }
    })
}

const getUser = (req, res) => {
    //Pega as infos da requisição
    const { userID } = req.body

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.errors[0].msg
        })
        return
    }

    //Instancia a classe criando uma vaga
    const apply = new applyService.Apply();

    //Tratamento das respostas do método da classe
    apply.getUser(userID).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                message: resul.message
            })
        } else {
            res.status(200).json({
                user: resul.user
            })
        }
    })
}

const getStatus = (req, res) => {
    //Pega as infos da requisição
    const { idVaga, idUser } = req.body

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.errors[0].msg
        })
        return
    }

    //Instancia a classe criando uma vaga
    const apply = new applyService.Apply();

    //Tratamento das respostas do método da classe
    apply.getStatus(idVaga, idUser).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                message: resul.message
            })
        } else {
            res.status(200).json({
                user: resul.user
            })
        }
    })
}

//Exporta as funções do controller para o ROUTER
module.exports = {
    getApply, getUser, getStatus
}