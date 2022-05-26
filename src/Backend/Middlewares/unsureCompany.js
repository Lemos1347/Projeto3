const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const sqlite = require('sqlite')

const ensureCompany = async ( req, res, next ) => {
    //Instancia o DB
    const db = await sqlite.open({ filename: './database/matchagas.db', driver: sqlite3.Database });

    //Verifica se é uma empresa
    const { user_id } = req

    const rowsInUser = await db.all(`SELECT * \ FROM users \ WHERE id = "${user_id}"`);
    const rowsInCompany = await db.all(`SELECT * \ FROM TB_COMPANY \ WHERE id = "${user_id}"`);

    if (rowsInUser[0]) {
        console.log('Aqui')
        if (rowsInUser[0].isAdmin != 1) {
            res.status(401).json({
                "message": "You don't have permission to this action"
            })
            return
        }
        return next();
    }

    if (rowsInCompany[0]) {
        return next();
    }

    res.status(401).json({
        "message": "Sorry try again later"
    })
    return
}

module.exports = {ensureCompany}