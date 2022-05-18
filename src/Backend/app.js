const express = require('express');
require('express-async-errors');
var bodyParser = require('body-parser')
// import { openDB } from './dao/configDb';

// const configDb = require('./dao/configDb')

const app = express()

app.use(express.json()) //Irá suportar JSON
app.use(bodyParser.urlencoded({ // Irá suportar urlenconded
    extended: true
}));

const PORT = process.env.PORT || 3001;

const UserRouter = require('./Routes/User')

app.use('/User', UserRouter);

app.use((err, req, res, next) => {    
    if (err instanceof Error) {
        console.log()
        res.status(500).json({
            error: err.message
        })
    } else {
        return res.status(500).json({
            status: 500,
            message: "Internal Server Error"
        })
    }    
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
})