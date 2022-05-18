const configDb = require('../dao/configDb');
const { v4: uuid } = require('uuid');
const sqlite3 = require('sqlite3').verbose();

let db = new sqlite3.Database("./database/matchagas.db", (err) => { 
    if (err) { 
        console.log('MENÓ deu erro quando foi criar o DB tá. Esse é o erro:', err) 
    } else { 
        console.log('Conexão com o DB criada com sucesso. CHAMA')  
    }
});

function queryEmail(email) {

    emailValidation = []

    db.get(`SELECT * \ FROM users \ WHERE email = "${email}"`, (err, result) => {
        if(err) {
            console.log(err)
            console.log('testeee')
        } else {
            emailValidation = result
        }
    })

    return emailValidation
}

class User {
    constructor (name, email, password) {
        if(!this.id) {
            this.id = uuid();
        }
        this.email = email;
        this.name = name;
        this.password = password;
    }

    async generateUser() {

        // function setVal(value) {
        //     emailAlredyExists = value;
        //     console.log('1', value)
        //     console.log('2', emailAlredyExists)
            
        // }


        const query = await queryEmail(this.email)

        console.log(query)
        if (query) {
            console.log('Teste')
            throw new Error("User already exists with this email")
        }
        
        if (!this.email) {
            throw new Error("Invalid Email")
        }

        if (!this.name) {
            throw new Error("Invalid Name")
        }

        if (!this.password) {
            throw new Error("Invalid PassWord")
        }

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

        return "Usuário cadastrado com sucesso!"
    }
}

// export { User }

module.exports = {
    User
}