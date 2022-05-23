const express = require('express');
const jwt = require('jsonwebtoken');

const unsureAuthenticated = (req, res, next) => {
    //Recebe o token inserido pela aplicação
    const authToken = req.headers.authorization;

    //Valida se o token está preenchido

    if (!authToken) {
        const error = {
            type: 'error',
            message: 'Token are required to access the services'
        }
        return error
    }

    //Valida se o token é válido

    [, token] = authToken.split(" ")

    try {
        //Verifica o Token
        const { sub } = jwt.verify(token, "4b0d30a9f642b3bfff67d0b5b28371a9")

        //Recupera infos do usuário
        req.user_id = sub
        return next();
    } catch(err) {
        res.status(401).json({
            message: "Token is not valid"
        })
        return
    }
}

module.exports = {
    unsureAuthenticated
}