require("dotenv").config(); 

const express = require('express');
const http = require('http');
const path = require('path');
const {Server} = require('socket.io');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const db = require("./config/mongoose-connection")
    

const app = express();  
const server = http.createServer(app);
const io = new Server(server);

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


// Routes Setup
app.use("/", indexRouter);
app.use("/user", userRouter);




const PORT = process.env.PORT || 3000;

server.listen(PORT , (err, res) => {
    console.log("Server listening on 3000");
});







