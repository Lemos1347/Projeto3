const companyService = require('../services/Company')
require('express-async-errors')
const { body, validationResult } = require("express-validator");

const createCompany = (req, res) => {
    //Pega as infos da requisição
    const { name, email, password, cnpj, phoneNumber, logo } = req.body;

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.errors[0].msg
        })
        return
    } else {
        //Instancia a classe criando uma compania
        const company = new companyService.Company(name, email, password, cnpj, phoneNumber, logo);

        //Tratamento das respostas do método da classe
        company.generateCompany().then((resul) => {
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
}

const updateCompany = (req, res) => {
    //Pega as infos da requisição
    const {name, email, password, cnpj, phoneNumber, logo } = req.body;

    const { user_id } = req

    //Instancia a classe criando uma compania
    const company = new companyService.Company();

    //Tratamento das respostas do método da classe
    company.updateCompany(user_id, name, email, password, cnpj, phoneNumber, logo).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
                message: resul.message,
            })
        }
    })
}

const deleteCompany = (req, res) => {
    //Pega as infos da requisição
    const { user_id } = req;

    //Instancia a classe criando uma compania
    const company = new companyService.Company();

    //Tratamento das respostas do método da classe
    company.deleteCompany(user_id).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
            })
        }
    })
}

const getCompanies = (req, res) => {
    //Instancia a classe criando uma compania
    const company = new companyService.Company();

    //Tratamento das respostas do método da classe
    company.getCompanies().then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).send({
                message: resul.message
            })
        }
    })
}

const getCompany = (req, res) => {
    //Instancia a classe criando uma compania
    const company = new companyService.Company();

    const { user_id } = req

    //Tratamento das respostas do método da classe
    company.getCompany(user_id).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message,
                isCompany: resul.isCompany
            })
        } else {
            res.status(200).send({
                message: resul.message,
                isCompany: resul.isCompany,
                name_company: resul.name_company,
                id_company: resul.id_company,
                email: resul.email,
                phoneNumber: resul.phoneNumber,
                logo_company: resul.logo_company,
                cnpj: resul.cnpj,
                isVerified: resul.isVerified
            })
        }
    })
}

const verifyAccount = (req, res) => {
    //Pega as infos da requisição
    const { token } = req.body

    const { user_id } = req

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.errors[0].msg
        })
        return
    }

    //Instancia a classe criando uma vaga
    const user = new companyService.Company();

    //Tratamento das respostas do método da classe
    user.verifyAccount(user_id, token).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
                message: resul.message
            })
        }
    })
}

const verifyCode = (req, res) => {
    //Pega as infos da requisição
    const { user_id } = req

    //Instancia a classe criando uma vaga
    const user = new companyService.Company();

    //Tratamento das respostas do método da classe
    user.verifyCode(user_id).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
                message: resul.message
            })
        }
    })
}

const sendNotification = (req, res) => {
    //Pega as infos da requisição
    const { qntVagas, nomeVaga } = req.body

    const { user_id } = req

    //Instancia a classe criando uma vaga
    const user = new companyService.Company();

    //Tratamento das respostas do método da classe
    user.sendNotification(user_id, qntVagas, nomeVaga).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
                message: resul.message
            })
        }
    })
}


//Exporta as funções do controller para o ROUTER
module.exports = {
    createCompany, updateCompany, deleteCompany, getCompanies, getCompany, verifyAccount, verifyCode, sendNotification
}