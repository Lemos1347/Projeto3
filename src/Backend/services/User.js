const configDb = require('../dao/configDb');
const { v4: uuid } = require('uuid');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite')

class User {
    constructor (name, email, password, bornDate, gender, cpf, phoneNumber, typeOfUser) {
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
    }

    async generateUser() {

        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        const rows = await db.all(`SELECT * \ FROM users \ WHERE email = "${this.email}"`);

        console.log(rows)

        if (rows[0] != undefined) {
            const error = {
                type: 'error',
                message: 'User Already Exists'
            }
            return error
        }

        if (!this.email) {
            const error = {
                type: 'error',
                message: 'Incorrect Email'
            }
            return error
        }

        if (!this.name) {
            const error = {
                type: 'error',
                message: 'Incorrect Name'
            }
            return error
        }

        if (!this.password) {
            const error = {
                type: 'error',
                message: 'Incorrect Password'
            }
            return error
        }

        if (!this.bornDate) {
            const error = {
                type: 'error',
                message: 'Incorrect BornDate'
            }
            return error
        }

        if (!this.gender) {
            const error = {
                type: 'error',
                message: 'Incorrect Gender'
            }
            return error
        }

        if (!this.cpf) {
            const error = {
                type: 'error',
                message: 'Incorrect CPF'
            }
            return error
        }

        if (!this.phoneNumber) {
            const error = {
                type: 'error',
                message: 'Incorrect Phone Number'
            }
            return error
        }

        await db.run("INSERT INTO users (id, name, email, password, bornDate, gender, cpf, phoneNumber, typeOfUser, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,'user',DateTime('now'),DateTime('now'))", [this.id, this.name, this.email , this.password, this.bornDate, this.gender, this.cpf, this.phoneNumber])

        const sucess = {
            type: 'success',
            message: {
                id: this.id,
                name: this.name,
                email: this.email
            }
        }
        return sucess
        // function setVal(value) {
        //     emailAlredyExists = value;
        //     console.log('1', value)
        //     console.log('2', emailAlredyExists)
            
        // }


        // const query = await queryEmail(this.email)

        // db.get(`SELECT * \ FROM users \ WHERE email = "${this.email}"`, (err, result) => {
        //     if(err) {
        //         console.log(err)
        //         console.log('testeee')
        //     } else {
        //         emailValidation = result
        //     }
        // }).then((valor) => {
        //     console.log(query)
        //     if (query) {
        //         console.log('Teste')
        //         throw new Error("User already exists with this email")
        //     }
        // })

        // var emailValidation

        // await db.get(`SELECT * \ FROM users \ WHERE email = "${this.email}"`, (err, result) => {
        //     if(err) {
        //         console.log(err)
        //         console.log('testeee')
        //     } else {
        //         emailValidation = result
        //         console.log("Resposta aqui",result);
        //         // if(rows.lengh()>=1)
        //         // {

        //         // }
        //         // else
        //         // {
                    
        //         // }
        //         throw new Error("Teste")
        //         return result.rows;
        //     }
        // })

        // //console.log(query)
        // // if (query) {
        // //     console.log('Teste')
        // //     throw new Error("User already exists with this email")
        // // }

        
        // if (!this.email) {
        //     throw new Error("Invalid Email")
        // }

        // if (!this.name) {
        //     throw new Error("Invalid Name")
        // }

        // if (!this.password) {
        //     throw new Error("Invalid PassWord")
        // }
        // const stmt = db.prepare("INSERT INTO lorem VALUES (?)");
        // stmt.run("Ipsum " + i);
        // db.run("INSERT INTO users (id, name, email, password, created_at, updated_at) VALUES (?,?,?,?,DateTime('now'),DateTime('now'))", 
        // [this.id, this.name, this.email , this.password],
        // (err, result) => {
        //     if(err) {
        //         console.log('aqui')
        //     } else {
        //         console.log('Valores inseridos')
        //         return("Usuário cadastrado com sucesso!")
        //     }
        // });

        // return "Usuário cadastrado com sucesso!"
    }
}

// export { User }

module.exports = {
    User
}