/* Only purpose of this is to sucessfully connect to Mongo DB cloud without any warning or error */
const mongoose = require('mongoose');
require('dotenv').config()
const connectionString = "mongodb://localhost:27017/studentModuleDB";

const connectDB = async () => {
    try {
        //await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
        await mongoose.connect(connectionString, {
            useNewUrlParser: true,
            useCreateIndex: true,
            useFindAndModify: false,
            useUnifiedTopology: true
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // Exit process with failure
        process.exit(1);
    }
};

module.exports = connectDB;