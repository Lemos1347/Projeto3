const userService = require('../services/User')
require('express-async-errors')

const createUser = (req, res) => {
    //Pega as infos da requisição
    const { name, email, password, bornDate, gender, cpf, phoneNumber, curriculum, typeOfUser } = req.body;

    //Instancia a classe criando uma vaga
    const user = new userService.User(name, email, password, bornDate, gender, cpf, phoneNumber, typeOfUser);

    //Tratamento das respostas do método da classe
    user.generateUser().then((resul) => {
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

    return user
}

const AuthUser = (req, res) => {
    //Pega as infos da requisição
    const { email, password } = req.body;

    //Instancia a classe criando uma vaga
    const user = new userService.User();

    //Tratamento das respostas do método da classe
    user.Authentication(email, password).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
                message: resul.message,
                token: resul.token,
            })
        }
    });
}

const UpdateUser = (req, res) => {
    //Pega as infos da requisição
    const { id, name, email, password, bornDate, gender, cpf, phoneNumber, curriculum, typeOfUser } = req.body;

    //Instancia a classe criando uma vaga
    const user = new userService.User();

    //Tratamento das respostas do método da classe
    user.updateUser(id, name, email, password, bornDate, gender, cpf, phoneNumber, curriculum, typeOfUser).then((resul) => {
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

const deleteUser = (req, res) => {
    //Pega as infos da requisição
    const { id } = req.body;

    //Instancia a classe criando uma vaga
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

const verifyCurriculum = (req, res) => {
    //Pega as infos da requisição
    const { user_id } = req

    //Instancia a classe criando uma vaga
    const user = new userService.User();

    //Tratamento das respostas do método da classe
    user.verifyCurriculum(user_id).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
                message: resul.message,
                haveCurriculum: resul.haveCurriculum
            })
        }
    })
}

const updatePermission = (req, res) => {
    //Pega as infos da requisição
    const { id, isAdmin } = req.body;

    //Instancia a classe criando uma vaga
    const user = new userService.User();

    //Tratamento das respostas do método da classe
    user.changeUserPermission(id, isAdmin).then((resul) => {
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

const getUser = (req, res) => {
    //Pega as infos da requisição
    const { id } = req.body

    //Instancia a classe criando uma vaga
    const user = new userService.User();

    //Tratamento das respostas do método da classe
    user.getUser(id).then((resul) => {
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

const getInfos = (req, res) => {
    //Pega as infos da requisição
    const { user_id } = req

    //Instancia a classe criando uma vaga
    const user = new userService.User();

    //Tratamento das respostas do método da classe
    user.getInfosTemp(user_id).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
                name: resul.name,
                id: resul.id,
                email: resul.email
            })
        }
    })
}

//Exporta as funções do controller para o ROUTER
module.exports = {
    createUser, AuthUser, UpdateUser, deleteUser, verifyCurriculum, updatePermission, getUser, getInfos
}