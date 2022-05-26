const { v4: uuid } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite')

class jobOffer {

    constructor(name, type, local, description, requirements, skills, name_company, id_company) {
        if(!this.id) {
            this.id = uuid();
        }
        this.name = name,
        this.type = type,
        this.local = local,
        this.description = description,
        this.requirements = requirements,
        this.skills = skills,
        this.nameCompany = name_company,
        this.idCompany = id_company
    }

    async createOffer() {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });
        
        //Validação de que todos os dados passados são != de ""
        if(!this.name) {
            const error = {
                type: 'error',
                message: 'Incorrect Name'
            }
            return error
        }
        if(!this.type) {
            const error = {
                type: 'error',
                message: 'Incorrect Type'
            }
            return error
        }
        if(!this.local) {
            const error = {
                type: 'error',
                message: 'Incorrect Local'
            }
            return error
        }
        if(!this.description) {
            const error = {
                type: 'error',
                message: 'Incorrect Description'
            }
            return error
        }
        if(!this.requirements) {
            const error = {
                type: 'error',
                message: 'Incorrect Requirements'
            }
            return error
        }
        if(!this.skills) {
            const error = {
                type: 'error',
                message: 'Incorrect SoftSkills'
            }
            return error
        }
        if(!this.nameCompany) {
            const error = {
                type: 'error',
                message: 'Incorrect Company Name'
            }
            return error
        }
        if(!this.idCompany) {
            const error = {
                type: 'error',
                message: 'Incorrect Company ID'
            }
            return error
        }

        //Validação da existência de outra vaga que possua a mesmo ID dessa que está sendo criada
        const rowsID = await db.all(`SELECT * \ FROM TB_JOBOFFER \ WHERE id = "${this.id}"`);

        if(rowsID[0]) {
            const error = {
                type: 'error',
                message: 'Another JobOffer already have this ID. Please try again.'
            }
            return error
        }
        
        //Inserção de infos passadas no DB
        const inserction = await db.run("INSERT INTO TB_JOBOFFER (id, name, type, location, description, requirements, skills, name_company, id_company, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,DateTime('now','localtime'),DateTime('now','localtime'))", [this.id, this.name, this.type , this.local, this.description, this.requirements, this.skills, this.nameCompany, this.idCompany]);

        if (inserction.changes === 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }

        //Informa a adição
        const sucess = {
            type: 'sucess',
            message: 'Informations Added',
        }
        return sucess
    }

    async updateOffer(idOffer, name, type, location, description, requirements, skills, nameCompany, idCompany) {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Criação variavel query
        let queryComponent = []

        //Verificar se o usuário passado é válido
        if (!idOffer) {
            const error = {
                type: 'error',
                message: 'Any ID of offer (to update) was passed'
            }
            return error
        }

        const rowsId = await db.all(`SELECT * \ FROM users \ WHERE id = "${idOffer}"`);

        if (!rowsId[0]){
            const error = {
                type: 'error',
                message: 'Offer not found'
            }
            return error
        }
        //Verificação quais informações foram solicitada a alteração
        if(name) {
            queryComponent.push(`name="${name}"`)
        }
        if(type) {
            queryComponent.push(`type="${type}"`)
        }
        if(location) {
            queryComponent.push(`location="${location}"`)
        }
        if(description) {
            queryComponent.push(`description="${description}"`)
        }
        if(requirements) {
            queryComponent.push(`requirements="${requirements}"`)
        }
        if(softSkills) {
            queryComponent.push(`skills="${skills}"`)
        }
        if(nameCompany) {
            queryComponent.push(`name_company="${nameCompany}"`)
        }

        if(idCompany) {
            queryComponent.push(`id_company="${idCompany}"`)
        }
        //Validação se nenhum dado foi passado
        if (!name && !type && !location && !description && !requirements && !skills && !nameCompany && !idCompany) {
            const error = {
                type: 'error',
                message: 'Any Information was passed to Update'
            }
            return error
        }
        //Junto todas as informações que foram solicitada a alteração
        const queryJoined = queryComponent.join(',')

        //Efetua a chamada para o DB, fazendo a atualização
        const Update = await db.run(`UPDATE TB_JOBOFFERS SET ${queryJoined}, updated_at=DateTime('now','localtime') WHERE id="${idOffer}"`)

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

    async deleteOffer(idOffer) {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verifica se o ID da vaga foi passado
        if(!idOffer) {
            const error = {
                type: 'error',
                message: 'ID is needed to delete the offer'
            }
            return error
        }
        //Verifica se o ID da vaga passado realmente existe
        const rowsIdDelete = await db.all(`SELECT * \ FROM TB_JOBOFFER \ WHERE id = "${idOffer}"`);

        if(!rowsIdDelete[0]) {
            if(!idOffer) {
                const error = {
                    type: 'error',
                    message: 'Any offer was found with this ID'
                }
                return error
            }
        }
        //Efetua a deleção
        const deleteOffer = await await db.run(`DELETE FROM TB_JOBOFFER WHERE id="${idOffer}"`);

        if (deleteOffer.changes === 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }
        //Informa a deleção

        const sucess = {
            type: 'sucess',
            message: 'Offer deleted',
        }

        return sucess
    }

    async applyOffer(idUser, idVaga) {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Validação dos dados passados
        if (!idUser) {
            const error = {
                type: 'error',
                message: 'ID of an user is needed'
            }
            return error
        }
        if (!idVaga) {
            const error = {
                type: 'error',
                message: 'ID of an vaga is needed'
            }
            return error
        }

        //Criação de ID para identificar a aplicação
        const idApplicant = uuid();

        //Verifica se o ID criado já existe ou não
        const rowsIdApplicant = await db.all(`SELECT * \ FROM TB_JOBOFFER_USERS \ WHERE id = "${idApplicant}"`);

        if(rowsIdApplicant[0]) {
            // idApplicant = uuid();
            // rowsIdApplicant = await db.all(`SELECT * \ FROM TB_JOBOFFER_USERS \ WHERE id = "${idApplicant}"`);
            // if(rowsIdApplicant[0]) {
            //     const error = {
            //         type: 'error',
            //         message: 'Internal Server Error'
            //     }
            //     return error
            // }  
            const error = {
                type: 'error',
                message: 'Internal Server Error'
            }
            return error
        }

        //Verifica do ID da empresa
        const forId = await db.run(`SELECT * \ FROM TB_JOBOFFER \ WHERE id = "${idVaga}"`)

        if (!forId[0]) {
            const error = {
                type: 'error',
                message: 'Any Offer was found with this ID'
            }
            return error
        }

        const idCompany = forId[0].id_company

        //Adiciona a aplicação
        const insertApllicant = await db.run("INSERT INTO TB_JOBOFFER_USERS (id, idVaga, id_users, id_company) VALUES (?,?,?,?)", [idApplicant, idVaga, idUser, idCompany]);

        if (insertApllicant.changes === 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }

        //Informa a adição da aplicação
        const sucess = {
            type: 'sucess',
            message: 'Applicant Added',
        }

        return sucess
    }

    async getOffers() {
        //Instanciação do DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        const query = await db.all("SELECT * \ FROM TB_JOBOFFER")

        const sucess = {
            type: 'sucess',
            offers: query
        }

        return sucess

    }
}

module.exports = { jobOffer }