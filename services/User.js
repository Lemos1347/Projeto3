const { v4: uuid } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite')
const nodemailer = require('nodemailer')
const SMTP_CONFIG = require('../dao/smtp')
const htmlEmail = require('../dao/htmlEmail')

class User {
    constructor (name, email, password, bornDate, gender, cpf, phoneNumber, typeOfUser, imgUser) {
        if(!this.id) {
            this.id = uuid();
        }
        this.email = email;
        this.name = name;
        this.password = password;
        this.bornDate = bornDate;
        this.gender = gender;
        this.cpf = cpf;
        this.phoneNumber = phoneNumber;
        this.typeOfUser = typeOfUser
        this.imgUser = imgUser
        this.curriculum = "";
    }

    async generateUser() {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verificação de senha != "", e HASH da mesma
        if(this.password) {
            const hashedPassWord = await bcrypt.hash(this.password, 8) 

            this.password = hashedPassWord
        }

        //Verificação da existência de um usuário com o mesmo EMAIL ou CPF

        const rowsEmailUserTable = await db.all(`SELECT * \ FROM users \ WHERE email = "${this.email}"`);
        const rowsEmailCompanyTable = await db.all(`SELECT * \ FROM TB_COMPANY \ WHERE email = "${this.email}"`);

        const rowsCPF = await db.all(`SELECT * \ FROM users \ WHERE cpf = "${this.cpf}"`);

        if (rowsEmailUserTable[0] || rowsEmailCompanyTable[0] ) {
            const error = {
                type: 'error',
                message: 'Email already in use'
            }
            return error
        }

        if (rowsCPF[0] != undefined) {
            const error = {
                type: 'error',
                message: 'User Already Registered With This CPF'
            }
            return error
        }

        //Gera o token de verificação
        let tokenToVerify = jwt.sign({
            email: this.id
        }, "3c353a34bb6ecf261b49db8ba1293577", {
            subject: this.id,
            expiresIn: "5m"
        });

        //Inserção das informações dentro do DB
        const inserction = await db.run("INSERT INTO users (id, name, email, password, bornDate, gender, cpf, phoneNumber, curriculum, typeOfUser, isVerified, imgUser, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,DateTime('now','localtime'),DateTime('now','localtime'))", [this.id, this.name, this.email , this.password, this.bornDate, this.gender, this.cpf, this.phoneNumber, this.curriculum, this.typeOfUser, false, this.imgUser])
        
        //Verifica se a inserção foi bem sucedido e assim retorna SUCESSO ou ERRO ao usuário
        if (inserction.changes === 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }

        //Envia o email ao usuário
        const transporter = nodemailer.createTransport({
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            secure: false,
            auth: {
                user: SMTP_CONFIG.user,
                pass: SMTP_CONFIG.pass
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        const mailSent = await transporter.sendMail({
            text: 'Texto do Email',
            subject: 'Ativação',
            from: "Noreply Matchagas <noreply@matchagas.com>",
            to: `${this.email}`,
            html: htmlEmail.emailRegister(tokenToVerify)
        })
        
        console.log(mailSent)

        const sucess = {
            type: 'success',
            message: {
                id: this.id,
                name: this.name,
                email: this.email
            }
        }
        return sucess
    }

    async Authentication(emailAuth, passwordAuth) {
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Requisição de busca na tabela "users" para verificar a existência de um usuário com o email indicado no LOGIN
        const rowsEmailTableUser = await db.all(`SELECT * \ FROM users \ WHERE email = "${emailAuth}"`);
        const rowsEmailTableCompany = await db.all(`SELECT * \ FROM TB_COMPANY \ WHERE email = "${emailAuth}"`);

        //Verifica se o usuário existe
        if (!rowsEmailTableUser[0] && !rowsEmailTableCompany[0]) {
            const error = {
                type: 'error',
                message: 'Invalid Email or Password'
            }
            return error
        }

        //Verificar se a senha inserida corresponde a do usuário
        let passwordMatch
        if (rowsEmailTableUser[0]) {
            passwordMatch = await bcrypt.compare(passwordAuth, rowsEmailTableUser[0].password);
        } else {
            passwordMatch = await bcrypt.compare(passwordAuth, rowsEmailTableCompany[0].password);
        }
        

        if(!passwordMatch) {
            const error = {
                type: 'error',
                message: 'Invalid Email or Password'
            }
            return error
        }

        //Gera o token de segurança do usuário, que possui tempo de expiração
        let token
        let typeOfUser

        if (rowsEmailTableUser[0]) {
            token = jwt.sign({
                email: rowsEmailTableUser[0].email
            }, "4b0d30a9f642b3bfff67d0b5b28371a9", {
                subject: rowsEmailTableUser[0].id,
                expiresIn: "1h"
            });
            typeOfUser = rowsEmailTableUser[0].typeOfUser
        } else {
            token = jwt.sign({
                email: rowsEmailTableCompany[0].email
            }, "4b0d30a9f642b3bfff67d0b5b28371a9", {
                subject: rowsEmailTableCompany[0].id,
                expiresIn: "1h"
            });
            typeOfUser = rowsEmailTableCompany[0].typeOfUser
        }
        const sucess = {
            type: 'sucess',
            message: 'Validated Credentials. User Logged',
            token: token,
            typeOfUser: typeOfUser
        }

        return sucess
    }

    async updateUser(idUser, name, email, password, bornDate, gender, cpf, phoneNumber, curriculum, typeOfUser, softSkills, hardSkills, imgUser) {

        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        let queryComponent = []

        //Verificar se o usuário passado é válido
        if (!idUser) {
            const error = {
                type: 'error',
                message: 'Any ID of user (to update) was passed'
            }
            return error
        }

        const rowsId = await db.all(`SELECT * \ FROM users \ WHERE id = "${idUser}"`);

        if (!rowsId[0]){
            const error = {
                type: 'error',
                message: 'User not found'
            }
            return error
        }

        //Verificar qual ou quais informação que o usuário deseja atualizar
        if(name) {
            queryComponent.push(`name="${name}"`)
        }
        if(email) {
            queryComponent.push(`email="${email}"`)
        }
        if(password) {
            const passwordHashed = await bcrypt.hash(password, 8)
            queryComponent.push(`password="${passwordHashed}"`)
        }
        if(bornDate) {
            queryComponent.push(`bornDate="${bornDate}"`)
        }
        if(gender) {
            queryComponent.push(`gender="${gender}"`)
        }
        if(cpf) {
            queryComponent.push(`cpf="${cpf}"`)
        }
        if(phoneNumber) {
            queryComponent.push(`phoneNumber="${phoneNumber}"`)
        }
        if(curriculum) {
            queryComponent.push(`curriculum='${curriculum}'`)
        }
        if(typeOfUser) {
            queryComponent.push(`typeOfUser="${typeOfUser}"`)
        }
        if(softSkills) {
            queryComponent.push(`softSkills="${softSkills}"`)
        }
        if(hardSkills) {
            queryComponent.push(`hardSkills="${hardSkills}"`)
        }
        if(imgUser) {
            queryComponent.push(`imgUser="${imgUser}"`)
        }
        //Validar se nenhuma informação foi enviada ao servidor
        if (!name && !email && !password && !bornDate && !gender && !cpf && !phoneNumber && !curriculum && !typeOfUser && !softSkills && !hardSkills && !imgUser) {
            const error = {
                type: 'error',
                message: 'Any Information was passed to Update'
            }
            return error
        }

        //Junto todas as informações que foram solicitada a alteração
        const queryJoined = queryComponent.join(',')

        //Efetua a chamada para o DB, fazendo a atualização
        const Update = await db.run(`UPDATE users SET ${queryJoined}, updated_at=DateTime('now','localtime') WHERE id="${idUser}"`)
        if (Update.changes == 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }
        //Informa a atualização
        const sucess = {
            type: 'sucess',
            message: 'Informations Updated',
        }

        return sucess
    }

    async deleteUser(id) {
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verificar se o usuário passado é válido
        if (!id) {
            const error = {
                type: 'error',
                message: 'Any ID of user (to delete) was passed'
            }
            return error
        }

        const rowsId = await db.all(`SELECT * \ FROM users \ WHERE id = "${id}"`);

        if (!rowsId[0]){
            const error = {
                type: 'error',
                message: 'User not found'
            }
            return error
        }

        //Efetua a deleção
        const deletedUser = await db.run(`DELETE FROM users WHERE id="${id}"`)
        //Verifica se a chamada para o DB ocorreu sem problemas
        if (deletedUser.changes == 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }
        //Mostra a validação de que o usuário foi deletado
        const sucess = {
            type: 'sucess',
            message: 'Informations Deleted',
        }

        return sucess

    }

    async verifyCurriculum(id) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verificar se um ID foi passado
        if (!id) {
            const error = {
                type: 'error',
                message: 'Needed ID to do this check'
            }
            return error
        }

        //Verificar se o ID passado existe
        const rowsId = await db.all(`SELECT * \ FROM users \ WHERE id = "${id}"`);

        if (!rowsId[0]) {
            const error = {
                type: 'error',
                message: 'Any users with this ID'
            }
            return error
        }

        //Verificar se existe currículo cadastrado para aquele ID
        const curriculum = rowsId[0].curriculum
        const softSkills = rowsId[0].softSkills

        let resp = {
            type: 'success',
        }

        if(!curriculum) {
            resp += {
                haveCurriculum: false
            }
        }

        if(!softSkills) {
            resp += {
                haveSoftSkills: false
            }
        }

        if (!curriculum || !softSkills) {
            return resp
        }

        const success = {
            type: 'success',
            message: "User exists, and have a curriculum",
            haveCurriculum: true,
            haveSoftSkills: true,
            isVerified: rowsId[0].isVerified,
            curriculum: curriculum,
        }
        return success
    }

    async changeUserPermission(id, isAdmin) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verificar se um ID foi passado e se um isAdmin também
        if (!id) {
            const error = {
                type: 'error',
                message: 'Needed ID to do this check'
            }
            return error
        }

        if (!isAdmin) {
            const error = {
                type: 'error',
                message: 'Needed a permission to user'
            }
            return error
        }

        //Verfica se o ID pertence a algum Usuário
        const rowsId = await db.all(`SELECT * \ FROM users \ WHERE id = "${id}"`);

        if (!rowsId[0]) {
            const error = {
                type: 'error',
                message: 'Any users with this ID'
            }
            return error
        }

        //Altera o tipo de permissão do Usuário
        const isAdminUpdate = await db.run(`UPDATE users SET isAdmin='${isAdmin}', updated_at=DateTime('now','localtime') WHERE id="${id}"`)
        if (isAdminUpdate.changes == 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }
        //Informa a atualização
        const sucess = {
            type: 'sucess',
            message: 'Informations Updated',
        }

        return sucess
    }

    async getUser(id) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verfica se o ID pertence a algum Usuário
        const rowsId = await db.all(`SELECT * \ FROM users \ WHERE id = "${id}"`);

        //Verifica se o usuário existe
        if (!rowsId[0]) {
            const error = {
                type: 'error',
                message: 'User not found'
            }
            return error
        }

        //Retorna infos ao client
        const sucess = {
            type: 'sucess',
            user: rowsId[0]
        }

        return sucess

    }

    async getUsers() {
        //Instancia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Pega do banco de dados todas as empresas cadastradas
        const getUsers = await db.all("SELECT name, id FROM users")

        if (getUsers == '') {
            const error = {
                type: 'error',
                message: 'Não há nenhum usuário cadastrado'
            }

            return error
        }

        const sucess = {
            type: 'sucess',
            message: getUsers,
        }

        return sucess
    }

    //SOMENTE PARA O TOKEN, JAMAIS FAÇA REQUISIÇÃO AQUI
    async getInfosTemp(idUser) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Valida se o ID está preenchido
        if (!idUser) {
            const error = {
                type: 'error',
                message: 'Invalid ID'
            }
            return error
        }

        //Verfica se o ID pertence a algum Usuário
        const rowsId = await db.all(`SELECT * \ FROM users \ WHERE id = "${idUser}"`);

        //Verifica se o usuário existe
        if (!rowsId[0]) {
            const error = {
                type: 'error',
                message: 'User not found'
            }
            return error
        }

        //Captura as informações do DB
        const { id, name, email, isAdmin, hardSkills, softSkills, isVerified, imgUser, curriculum } = rowsId[0]

        //Retorna infos ao client
        const sucess = {
            type: 'sucess',
            name: name,
            id: idUser,
            email: email,
            isAdmin: isAdmin,
            hardSkills: hardSkills,
            softSkills: softSkills,
            isVerified: isVerified,
            imgUser: imgUser, 
            curriculum: curriculum
        }

        return sucess
    }

    async getVagasAplicadas(id) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verfica se o ID pertence a algum Usuário
        const rowsId = await db.all(`SELECT * \ FROM users \ WHERE id = "${id}"`);

        //Verifica se o usuário existe
        if (!rowsId[0]) {
            const error = {
                type: 'error',
                message: 'User not found'
            }
            return error
        }

        //Carrega todas as vagas para as quais os usuários se aplicaram
        
    }

    async forgetPassword(email) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verfica se o usuário com o EMAIL passado
        const rowsEmail = await db.all(`SELECT * \ FROM users \ WHERE email = "${email}"`);

        if (rowsEmail == "") {
            const error = {
                type: 'success',
                message: 'Email verification was sent',
                trueMessage: false
            }
            return error
        }

        //Gera um código para troca de senha
        var resetCode = Math.floor(1000 + Math.random() * 9000);

        //Envia o email ao usuário
        const transporter = nodemailer.createTransport({
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            secure: false,
            auth: {
                user: SMTP_CONFIG.user,
                pass: SMTP_CONFIG.pass
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        const mailSent = await transporter.sendMail({
            text: 'Texto do Email',
            subject: 'Esqueci minha senha',
            from: "Noreply Matchagas <noreply@matchagas.com>",
            to: `${email}`,
            html: htmlEmail.forgotPassword(resetCode)
        })

        //Salva o código enviado para o usuário no Banco de Dados
        const setResetCode = await db.run(`UPDATE users SET resetPassCode="${resetCode}" WHERE email = "${email}"`);

        if (setResetCode.changes == 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }

        //Retorna infos ao client
        const sucess = {
            type: 'sucess',
            message: "Instruções enviadas por email",
            trueMessage: true
        }

        return sucess
    }

    async resetPasswordByCode(email, resetCode, newPass) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verifica qual o Código passado para o usuário
        const code = await db.all(`SELECT resetPassCode FROM users WHERE email="${email}"`)
        if(code[0].resetPassCode == '') {
            const error = {
                type: 'error',
                message: "This account didn't solicitated any redifine"
            }
            return error
        }

        if (Number(code[0].resetPassCode) != resetCode) {
            const error = {
                type: 'error',
                message: "Código Inválido"
            }
            return error
        }

        //Redefine a senha
        const hashedPassWord = await bcrypt.hash(newPass, 8)

        const redefinePass = await db.run(`UPDATE users SET password="${hashedPassWord}" WHERE email = "${email}"`);

        if (redefinePass.changes == 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }

        //Redefine o código de segurança para ""
        await db.run(`UPDATE users SET resetPassCode="" WHERE email = "${email}"`);

        const success = {
            type: 'success',
            message: "Senha alterada com sucesso",
            validation: true
        }
        return success
    }

    async verifyAccount(userId, token) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        const userExists = await db.all(`SELECT isVerified FROM users WHERE id="${userId}"`)
        const companyExists = await db.all(`SELECT isVerified FROM TB_COMPANY WHERE id="${userId}"`)

        //Verifica se o usuário passado existe
        if (!userExists[0] && !companyExists[0]) {
            const error = {
                type: 'error',
                message: "Usuário passado não existe"
            }
            return error
        }

        let type

        if(userExists[0]) {
            console.log('teste')
            type = 'user'
        }

        if (companyExists[0]) {
            console.log('teste1')
            type = 'company'
        }

        if (type == 'user') {
            //Verifica se o usuário já foi verificado
            if (Boolean(userExists[0].isVerified)) {
                const error = {
                    type: 'error',
                    message: "Usuário passado já foi validado"
                }
                return error
            }

            //Verifica a validade do token
            try {
                //Verifica o Token
                const { sub } = jwt.verify(token, "3c353a34bb6ecf261b49db8ba1293577")
        
                //Valida se o usuário é o proprietário do token
                if (sub != userId) {
                    const error = {
                        type: 'error',
                        message: "Token Expirado! Por favor gere um novo."
                    }
                    return error
                }

                const validateUser = await db.run(`UPDATE users SET isVerified=true WHERE id = "${userId}"`);

                if (validateUser.changes === 0) {
                    const error = {
                        type: 'error',
                        message: 'Database Error, please try again later'
                    }
                    return error
                }

                const success = {
                    type: 'success',
                    message: "Usuário Validado"
                }
                return success
            } catch(err) {
                //Retorna o erro caso o token não seja válido
                const error = {
                    type: 'error',
                    message: "Token Expirado! Por favor gere um novo."
                }
                return error
            }
        } else if (type == 'company') {
            //Verifica se o usuário já foi verificado
            if (Boolean(companyExists[0].isVerified)) {
                const error = {
                    type: 'error',
                    message: "Empresa passada já foi validada"
                }
                return error
            }

            //Verifica a validade do token
            try {
                //Verifica o Token
                const { sub } = jwt.verify(token, "3c353a34bb6ecf261b49db8ba1293577")
        
                //Valida se o usuário é o proprietário do token
                if (sub != userId) {
                    const error = {
                        type: 'error',
                        message: "Token Expirado! Por favor gere um novo."
                    }
                    return error
                }

                const validateUser = await db.run(`UPDATE TB_COMPANY SET isVerified=true WHERE id = "${userId}"`);

                if (validateUser.changes === 0) {
                    const error = {
                        type: 'error',
                        message: 'Database Error, please try again later'
                    }
                    return error
                }

                const success = {
                    type: 'success',
                    message: "Usuário Validado"
                }
                return success
            } catch(err) {
                //Retorna o erro caso o token não seja válido
                const error = {
                    type: 'error',
                    message: "Token Expirado! Por favor gere um novo."
                }
                return error
            }
        }
        
    }

    async verifyCode(userId) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        const userExists = await db.all(`SELECT email FROM users WHERE id="${userId}"`)

        if (!userExists[0]) {
            const error = {
                type: 'error',
                message: "Usuário passado não existe"
            }
            return error
        }

        //Verifica se o usuário já foi verificado
        if (Boolean(userExists[0].isVerified)) {
            const error = {
                type: 'error',
                message: "Usuário passado já foi validado"
            }
            return error
        }

        //Gera o token de verificação
        let tokenToVerify = jwt.sign({
            email: userId
        }, "3c353a34bb6ecf261b49db8ba1293577", {
            subject: userId,
            expiresIn: "5m"
        });

        //Envia o email ao usuário
        const transporter = nodemailer.createTransport({
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            secure: false,
            auth: {
                user: SMTP_CONFIG.user,
                pass: SMTP_CONFIG.pass
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        const mailSent = await transporter.sendMail({
            text: 'Texto do Email',
            subject: 'Ativação',
            from: "Noreply Matchagas <noreply@matchagas.com>",
            to: `${userExists[0].email}`,
            html: htmlEmail.emailRegister(tokenToVerify)
        })

        console.log(mailSent)

        const success = {
            type: 'success',
            message: "Mensagem Reenviada"
        }
        return success
    }

    async sendNotification(userId, qntVagas) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verifica a existência do usuário
        const userExists = await db.all(`SELECT email FROM users WHERE id="${userId}"`)

        if (!userExists[0]) {
            const error = {
                type: 'error',
                message: "Usuário passado não existe"
            }
            return error
        }

        //Envia o email ao usuário
        const transporter = nodemailer.createTransport({
            host: SMTP_CONFIG.host,
            port: SMTP_CONFIG.port,
            secure: false,
            auth: {
                user: SMTP_CONFIG.user,
                pass: SMTP_CONFIG.pass
            },
            tls: {
                rejectUnauthorized: false
            }
        })

        const mailSent = transporter.sendMail({
            text: 'Texto do Email',
            subject: 'Novidades',
            from: "Noreply Matchagas <noreply@matchagas.com>",
            to: `${userExists[0].email}`,
            html: htmlEmail.notificationUser(qntVagas)
        })

        const success = {
            type: 'success',
            message: "Mensagem enviada"
        }
        return success
    }

    async deleteAdmin(id) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Busca pelo ID em Users e Companies
        const rowsIdUsers = await db.all(`SELECT * \ FROM users \ WHERE id = "${id}"`);
        const rowsIdCompanies = await db.all(`SELECT * \ FROM TB_COMPANY \ WHERE id = "${id}"`);

        if (!rowsIdUsers[0] && !rowsIdCompanies[0]) {
            const error = {
                type: 'error',
                message: 'User not found'
            }
            return error
        }

        //Se o usuário passado for uma company
        if (rowsIdUsers[0]) {
            const deleteUser = await db.run(`DELETE FROM users WHERE id="${id}"`)

            if (deleteUser.changes == 0) {
                const error = {
                    type: 'error',
                    message: 'Database Error, please try again later'
                }
                return error
            }
    
            const success = {
                type: "success",
                message: "Usuário deletado",
            }

            return success
        }

        //Se o usuário passado for um user
        if (rowsIdCompanies[0]) {
            //Deleta a empresa
            const deleteCompany = await db.run(`DELETE FROM TB_COMPANY WHERE id="${id}"`)

            //Deleta todas as vagas que essa empresa possui
            const deletedVagas = await db.run(`DELETE FROM TB_JOBOFFER WHERE id_company="${id}"`)

            //Deleta todas as candidaturas que estão relacionadas a essa empresa
            const deletedApplies = await db.run(`DELETE FROM TB_JOBOFFER_USERS WHERE id_company="${id}"`)

            if (deleteCompany.changes == 0 && deletedVagas.changes == 0 && deletedApplies.changes == 0) {
                const error = {
                    type: 'error',
                    message: 'Database Error, please try again later'
                }
                return error
            }
    
            const success = {
                type: "success",
                message: "Empresa deletada",
            }

            return success
        }
    }
}

module.exports = {
    User
}