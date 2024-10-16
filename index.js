// NPM IMPORTS
require('dotenv').config({
    path: './config.env'
})
const mongoose = require('mongoose');


// CUSTOM MODULE IMPORTS
const app = require('./app')


// CONSTANT IMPORT
const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI;

const start = async () => {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to DB")
    app.listen(PORT, () => {
        console.log(`Server is listening on PORT ${PORT}...`)
    })

}

start()