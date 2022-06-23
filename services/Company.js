const { v4: uuid } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite')
const nodemailer = require('nodemailer')
const SMTP_CONFIG = require('../dao/smtp')
const htmlEmail = require('../dao/htmlEmail')

class Company {
    constructor (name, email, password, cnpj, phoneNumber, logo) {
        if(!this.id) {
            this.id = uuid();
        }
        this.email = email;
        this.name = name;
        this.password = password;
        this.cnpj = cnpj;
        this.phoneNumber = phoneNumber;
        this.typeOfUser = "company";
        this.logo = logo
    }

    async generateCompany() {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verificação de senha != "", e HASH da mesma
        if(this.password) {
            const hashedPassWord = await bcrypt.hash(this.password, 8) 

            this.password = hashedPassWord
        }

        //Verificação da existência de um usuário com o mesmo EMAIL ou CNPJ

        const rowsEmailCompanyTable = await db.all(`SELECT * \ FROM TB_COMPANY \ WHERE email = "${this.email}"`);
        const rowsEmailUserTable = await db.all(`SELECT * \ FROM users \ WHERE email = "${this.email}"`);

        const rowsCNPJ = await db.all(`SELECT * \ FROM TB_COMPANY \ WHERE cnpj = "${this.cnpj}"`);

        if (rowsEmailCompanyTable[0] != undefined || rowsEmailUserTable[0] != undefined) {
            const error = {
                type: 'error',
                message: 'Email already in use'
            }
            return error
        }

        if (rowsCNPJ[0] != undefined) {
            const error = {
                type: 'error',
                message: 'Company Already Registered With This CNPJ'
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
        const inserction = await db.run("INSERT INTO TB_COMPANY (id, name, email, password, cnpj, phoneNumber, typeOfUser, logo, isVerified, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,DateTime('now','localtime'),DateTime('now','localtime'))", [this.id, this.name, this.email , this.password, this.cnpj, this.phoneNumber, this.typeOfUser, this.logo, false])
        
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
            subject: 'Assunto da mensagem',
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

async updateCompany(idCompany, name, email, password, cnpj, phoneNumber, logo) {

        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        let queryComponent = []

        //Verificar se o usuário passado é válido
        if (!idCompany) {
            const error = {
                type: 'error',
                message: 'Any ID of company (to update) was passed'
            }
            return error
        }

        const rowsId = await db.all(`SELECT * \ FROM TB_COMPANY \ WHERE id = "${idCompany}"`);

        if (!rowsId[0]){
            const error = {
                type: 'error',
                message: 'Company not found'
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
        if(cnpj) {
            queryComponent.push(`cnpj="${cnpj}"`)
        }
        if(phoneNumber) {
            queryComponent.push(`phoneNumber="${phoneNumber}"`)
        }
        if(logo) {
            queryComponent.push(`logo="${logo}"`)
        }

        //Validar se nenhuma informação foi enviada ao servidor
        if (!name && !email && !password && !cnpj && !phoneNumber && !logo) {
            const error = {
                type: 'error',
                message: 'Any Information was passed to Update'
            }
            return error
        }

        //Junto todas as informações que foram solicitada a alteração
        const queryJoined = queryComponent.join(',')

        //Efetua a chamada para o DB, fazendo a atualização
        const Update = await db.run(`UPDATE TB_COMPANY SET ${queryJoined}, updated_at=DateTime('now','localtime') WHERE id="${idCompany}"`)
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

    async deleteCompany(id) {
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verificar se a empresa passada é válida
        if (!id) {
            const error = {
                type: 'error',
                message: 'Any ID of company (to delete) was passed'
            }
            return error
        }

        const rowsId = await db.all(`SELECT * \ FROM TB_COMPANY \ WHERE id = "${id}"`);

        if (!rowsId[0]){
            const error = {
                type: 'error',
                message: 'Company not found'
            }
            return error
        }

        //Efetua a deleção
        const deletedCompany = await db.run(`DELETE FROM TB_COMPANY WHERE id="${id}"`)

        //Deleta todas as vagas que essa empresa possui
        const deletedVagas = await db.run(`DELETE FROM TB_JOBOFFER WHERE id_company="${id}"`)

        //Deleta todas as candidaturas que estão relacionadas a essa empresa
        const deletedApplies = await db.run(`DELETE FROM TB_JOBOFFER_USERS WHERE id_company="${id}"`)

        //Verifica se a chamada para o DB ocorreu sem problemas
        if (deletedCompany.changes == 0 && deletedVagas.changes == 0 && deletedApplies.changes == 0) {
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

    async getCompany(id) {
        //Instancia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Pega a empresa correspondente ao id passado
        const getCompanies = await db.all(`SELECT * FROM TB_COMPANY WHERE id="${id}"`)

        if (!getCompanies[0]) {
            const error = {
                type: 'success',
                message: 'Empresa não encontrada',
                isCompany: false
            }

            return error
        }

        //Mostra a validação de que o usuário foi deletado
        const sucess = {
            type: 'sucess',
            message: 'Usuário é uma empresa',
            isCompany: true,
            name_company: getCompanies[0].name,
            id_company: getCompanies[0].id,
            logo_company: getCompanies[0].logo,
            email: getCompanies[0].email,
            cnpj: getCompanies[0].cnpj,
            phoneNumber: getCompanies[0].phoneNumber,
            isVerified: getCompanies[0].isVerified
        }
        return sucess
    }

    async getCompanies() {
        //Instancia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Pega do banco de dados todas as empresas cadastradas
        const getCompanies = await db.all("SELECT name, id FROM TB_COMPANY")

        if (getCompanies == '') {
            const error = {
                type: 'error',
                message: 'Não há nenhuma empresa cadastrada'
            }

            return error
        }

        const sucess = {
            type: 'sucess',
            message: getCompanies,
        }

        return sucess
    }

    async sendNotification(companyId, qntVagas, nameVaga) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        if (!idUser) {
            const error = {
                type: 'error',
                message: "Nenhum ID passado para verificação"
            }
            return error
        }

        //Verifica a existência do usuário
        const companyExists = await db.all(`SELECT email FROM TB_COMPANY WHERE id="${companyId}"`)

        if (!companyExists[0]) {
            const error = {
                type: 'error',
                message: "Empresa passada não existe"
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
            subject: 'Assunto da mensagem',
            from: "Noreply Matchagas <noreply@matchagas.com>",
            to: `${companyExists[0].email}`,
            html: `
            <!doctype html>
            <html lang="en-US">

            <head>
                <meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
                <title>Reset Password Email Template</title>
                <meta name="description" content="Reset Password Email Template.">
                <style type="text/css">
                    a:hover {text-decoration: underline !important;}
                </style>
            </head>

            <body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
                <!--100% body table-->
                <table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
                    style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
                    <tr>
                        <td>
                            <table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
                                align="center" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="height:80px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="text-align:center;">
                                    <a href="https://braziliansintech.com" title="logo" target="_blank">
                                        <img width="160" src="https://braziliansintech.com/static/img/logo.png" title="logo" alt="logo">
                                    </a>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td>
                                        <table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
                                            style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                            <tr>
                                                <td style="padding:0 35px;">
                                                    <h1 style="color:#F3C42E; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">Lembrança!</h1>
                                                    <span
                                                        style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
                                                    <p style="color:#455056; font-size:15px;line-height:24px; margin:0;">Nós da BIT temos uma surpresa para você, da última vez que você esteve em nosso site fizemos um relaório para você! Verificamos a quantidade de usuários que possuem um perfil com mais de 60% de semelhança ao que você como empresa busca na vaga.</p>
                                                <label style="display:inline-block; vertical-align:middle; font-family:'Rubik',sans-serif;color:#455056; font-size:15px;line-height:24px; margin:0;">Quantidade de usuários na vaga ${nameVaga}: </label>
                                                    <label href="javascript:void(0);"
                                                        style="background:#530084;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">${qntVagas}</label>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td style="height:40px;">&nbsp;</td>
                                            </tr>
                                        </table>
                                    </td>
                                <tr>
                                    <td style="height:20px;">&nbsp;</td>
                                </tr>
                                <tr>
                                    <td style="text-align:center;">
                                        <p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>www.braziliansintech.com</strong></p>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="height:80px;">&nbsp;</td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                </table>
                <!--/100% body table-->
            </body>

            </html>
            `
        })

        const success = {
            type: 'success',
            message: "Mensagem enviada"
        }
        return success
    }

    async verifyAccount(companyId, token) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        const userExists = await db.all(`SELECT isVerified FROM TB_COMPANY WHERE id="${companyId}"`)

        //Verifica se o usuário passado existe
        if (!userExists[0]) {
            const error = {
                type: 'error',
                message: "Empresa passada não existe"
            }
            return error
        }

        //Verifica se o usuário já foi verificado
        if (Boolean(userExists[0].isVerified)) {
            const error = {
                type: 'error',
                message: "Empresa passada já foi validada"
            }
            return error
        }

        //
        try {
            //Verifica o Token
            const { sub } = jwt.verify(token, "3c353a34bb6ecf261b49db8ba1293577")
    
            //Valida se o usuário é o proprietário do token
            if (sub != companyId) {
                const error = {
                    type: 'error',
                    message: "Token Expirado! Por favor gere um novo."
                }
                return error
            }

            const validateUser = await db.run(`UPDATE TB_COMPANY SET isVerified=true WHERE id = "${companyId}"`);

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

    async verifyCode(companyId) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        const companyExists = await db.all(`SELECT email FROM TB_COMPANY WHERE id="${companyId}"`)

        if (!companyExists[0]) {
            const error = {
                type: 'error',
                message: "Empresa passada não existe"
            }
            return error
        }

        //Verifica se o usuário já foi verificado
        if (Boolean(companyExists[0].isVerified)) {
            const error = {
                type: 'error',
                message: "Empresa passada já foi validado"
            }
            return error
        }

        //Gera o token de verificação
        let tokenToVerify = jwt.sign({
            email: companyId
        }, "3c353a34bb6ecf261b49db8ba1293577", {
            subject: companyId,
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
            subject: 'Assunto da mensagem',
            from: "Noreply Matchagas <noreply@matchagas.com>",
            to: `${companyExists[0].email}`,
            html: htmlEmail.emailRegister(tokenToVerify)
        })

        const success = {
            type: 'success',
            message: "Mensagem Reenviada"
        }
        return success
    }
}

module.exports = {
    Company
}