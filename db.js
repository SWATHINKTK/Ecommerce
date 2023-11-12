const mongoose = require('mongoose');

const dbConnectionString = process.env.DB_CONNECTION_STRING

const connectDB = async()=>{

    mongoose.connect(dbConnectionString)
        .then(()=> console.log("Database Connection Successful"))
        .catch((error) => console.log("Connection Lost  : ",error));

}

module.exports = connectDB;