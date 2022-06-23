const { validationResult } = require('express-validator');
const userService = require('../services/User')
require('express-async-errors')

const createUser = (req, res) => {
    //Pega as infos da requisição
    const { name, email, password, bornDate, gender, cpf, phoneNumber, curriculum, typeOfUser } = req.body;

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.errors[0].msg
        })
        return
    } else {
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

    
}

const AuthUser =  (req, res) => {
    //Pega as infos da requisição
    const { email, password } = req.body;

    //Instancia a classe criando uma vaga
    const user = new userService.User();

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.errors[0].msg
        })
        return
    }

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
                typeOfUser: resul.typeOfUser,
            })
        }
    });
}

const UpdateUser = (req, res) => {
    //Pega as infos da requisição
    const { name, email, password, bornDate, gender, cpf, phoneNumber, curriculum, typeOfUser, softSkills, hardSkills, imgUser } = req.body;

    const { user_id } = req

    //Instancia a classe criando uma vaga
    const user = new userService.User();

    //Tratamento das respostas do método da classe
    user.updateUser(user_id, name, email, password, bornDate, gender, cpf, phoneNumber, curriculum, typeOfUser, softSkills, hardSkills, imgUser).then((resul) => {
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
    const { user_id } = req;

    //Instancia a classe criando uma vaga
    const user = new userService.User();

    //Tratamento das respostas do método da classe
    user.deleteUser(user_id).then((resul) => {
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
                haveCurriculum: resul.haveCurriculum,
                haveSoftSkills: resul.haveSoftSkills,
                curriculum: resul.curriculum,
                isVerified: resul.isVerified
            })
        }
    })
}

const updatePermission = (req, res) => {
    //Pega as infos da requisição
    const { id, isAdmin } = req.body;

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.errors[0].msg
        })
        return
    }

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
    const { user_id } = req

    //Instancia a classe criando uma vaga
    const user = new userService.User();
    //Tratamento das respostas do método da classe
    user.getUser(user_id).then((resul) => {
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
                email: resul.email,
                isAdmin: resul.isAdmin,
                hardSkills: resul.hardSkills,
                softSkills: resul.softSkills,
                isVerified: resul.isVerified,
                imgUser: resul.imgUser,
                curriculum: resul.curriculum
            })
        }
    })
}

const getUsers = (req, res) => {
    //Instancia a classe criando uma compania
    const user = new userService.User();

    //Tratamento das respostas do método da classe
    user.getUsers().then((resul) => {
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

const resetPassWord = (req, res) => {
    //Pega as infos da requisição
    const { email } = req.body

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.errors[0].msg
        })
        return
    }

    //Instancia a classe criando uma vaga
    const user = new userService.User();

    //Tratamento das respostas do método da classe
    user.forgetPassword(email).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
                message: resul.message,
                trueMessage: resul.trueMessage
            })
        }
    })
}

const redefinePassWord = (req, res) => {
    //Pega as infos da requisição
    const { email, code, newPass } = req.body

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.errors[0].msg
        })
        return
    }

    //Instancia a classe criando uma vaga
    const user = new userService.User();

    //Tratamento das respostas do método da classe
    user.resetPasswordByCode(email, code, newPass).then((resul) => {
        if(resul.type === "error") {
            res.status(500).json({
                error: resul.message
            })
        } else {
            res.status(200).json({
                message: resul.message,
                validation: resul.validation
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
    const user = new userService.User();

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
    const user = new userService.User();

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
    const { qntVagas } = req.body

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
    const user = new userService.User();

    //Tratamento das respostas do método da classe
    user.sendNotification(user_id, qntVagas).then((resul) => {
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

const deleteUsers = (req, res) => {
    //Pega as infos da requisição
    const { id } = req.body

    //Valida se algum paremetro é inválido
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
        res.status(400).json({
            error: errors.errors[0].msg
        })
        return
    }

    //Instancia a classe criando uma vaga
    const user = new userService.User();

    //Tratamento das respostas do método da classe
    user.deleteAdmin(id).then((resul) => {
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
    createUser, AuthUser, UpdateUser, deleteUser, verifyCurriculum, updatePermission, getUser, getInfos, resetPassWord, redefinePassWord, getUsers, verifyAccount, verifyCode, sendNotification, deleteUsers
}