const userService = require('../services/User')
require('express-async-errors')

const createUser = (req, res) => {

    const { name, email, password, bornDate, gender, cpf, phoneNumber } = req.body;

    const user = new userService.User(name, email, password, bornDate, gender, cpf, phoneNumber);

    console.log(user.email)

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

module.exports = {
    createUser
}