const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite')

//Classe para o match da vaga com a usuária
class Apply {
    
    async getUserApplied(idVaga, idUser, status) {
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Junta as tabelas em que existam aplicação com as respectivas informações do usuário
        const idApp = await db.all(`SELECT id FROM TB_JOBOFFER_USERS WHERE id_vaga="${idVaga}" AND id_users="${idUser}"`)

        if (!idApp) {
            const error = {
                type: "error",
                message: "Usuário não candidatado"
            }
            return error
        }

        const statusAtt = await db.run(`UPDATE TB_JOBOFFER_USERS SET status="${status}" WHERE id="${idApp[0].id}"`)

        if (statusAtt.changes == 0) {
            const error = {
                type: 'error',
                message: 'Database Error, please try again later'
            }
            return error
        }

        const success = {
            type: "success",
            message: "Status da candidatura atualizado",
        }

        return success
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

    async getStatus(idVaga, idUser) {
        //Instacia o DB
        const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

        //Verfica se o ID pertence a algum Usuário
        const rowsId = await db.all(`SELECT * \ FROM TB_JOBOFFER_USERS \ WHERE id_vaga = "${idVaga}" and id_users = "${idUser}"`);

        //Verifica se o usuário existe
        if (!rowsId[0]) {
            const error = {
                type: 'error',
                message: 'Candidatura não encontrada'
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
}

module.exports = { Apply }