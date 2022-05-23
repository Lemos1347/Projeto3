const { v4: uuid } = require('uuid');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite')

class jobOffer {

    constructor(name, type, local, description, requirements, softSkills, nameCompany, idCompany) {
        if(!this.id) {
            this.id = uuid();
        }
        this.name = name,
        this.type = type,
        this.local = local,
        this.description = description,
        this.requirements = requirements,
        this.softSkills = softSkills,
        this.nameCompany = nameCompany,
        this.idCompany = idCompany
    }

    createOffer() {
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
        if(!this.softSkills) {
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
        const rowsID = await db.all(`SELECT * \ FROM joboffers \ WHERE id = "${this.id}"`);

        if(rowsID[0]) {
            const error = {
                type: 'error',
                message: 'Another JobOffer already have this ID. Please try again.'
            }
            return error
        }
        
        //Inserção de infos passadas no DB
        const inserction = db.run("INSERT INTO joboffers (id, name, type, local, description, requirements, sofSkills, nameCompany, idCompany, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?,DateTime('now','localtime'),DateTime('now','localtime'))", [this.id, this.name, this.type , this.local, this.description, this.requirements, this.softSkills, this.nameCompany, this.idCompany]);
    }
}

module.exports = { jobOffer }