const userService = require('../services/User')

const createUser = (req, res) => {

    const { name, email, password } = req.body;

    const user = new userService.User(name, email, password);

    const resultado = user.generateUser();

    res.json({
        message: resultado
    })

    return user
}

module.exports = {
    createUser
}