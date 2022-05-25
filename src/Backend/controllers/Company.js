const companyService = require('../services/Company')
require('express-async-errors')

const createCompany = (req, res) => {

    const { name, email, password, cnpj, phoneNumber, logo } = req.body;

    const company = new companyService.Company(name, email, password, cnpj, phoneNumber, logo);

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
    const { id, name, email, password, cnpj, phoneNumber, logo } = req.body;

    const user = new companyService.Company();

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
    const { id } = req.body;

    const user = new userService.User();

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

module.exports = {
    createCompany, updateCompany, deleteCompany
}