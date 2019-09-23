const express = require('express');
const connectDB = require('./config/db');
const path = require('path');

const app = express();

// Connect Database
connectDB();

// Init Middleware
app.use(express.json({ extended: false }));

app.get('/', (req,res)=>{
    res.send("hello world")
})

// Define Routes
app.use('/api/login', require('./routes/api/login'));
app.use('/api/signup', require('./routes/api/signup'));
app.use('/api/protectedRoute', require('./routes/api/protectedRoute'));

const PORT = process.env.PORT //|| 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));