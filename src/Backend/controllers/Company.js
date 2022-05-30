const companyService = require('../services/Company')
require('express-async-errors')

const createCompany = (req, res) => {
    //Pega as infos da requisição
    const { name, email, password, cnpj, phoneNumber, logo } = req.body;

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

    return company
}

const updateCompany = (req, res) => {
    //Pega as infos da requisição
    const { id, name, email, password, cnpj, phoneNumber, logo } = req.body;

    //Instancia a classe criando uma compania
    const user = new companyService.Company();

    //Tratamento das respostas do método da classe
    user.updateCompany(id, name, email, password, cnpj, phoneNumber, logo).then((resul) => {
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
    const { id } = req.body;

    //Instancia a classe criando uma compania
    const user = new userService.User();

    //Tratamento das respostas do método da classe
    user.deleteUser(id).then((resul) => {
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


//Exporta as funções do controller para o ROUTER
module.exports = {
    createCompany, updateCompany, deleteCompany
}