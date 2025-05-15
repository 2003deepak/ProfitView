require("dotenv").config(); 

const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const morgan = require("morgan");
const db = require("./config/mongoose-connection");



const app = express();  
const server = http.createServer(app);


// Setting Up Middleware for CORS
app.use(cors({
    origin: 'http://localhost:5173', 
    credentials: true, 
}));



// Routes Import 
const indexRouter = require('./routes/indexRouter');
const userRouter = require('./routes/userRouter');

// Setting Up Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(morgan('dev')); 

// Routes Setup
app.use("/api", indexRouter);
app.use("/api/user", userRouter);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log("Server listening on port 3000");
});
