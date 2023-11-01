const path = require('path');
const express = require("express");
const morgan = require('morgan');
const app = express();
const jwt = require("jsonwebtoken");

app.use(morgan('dev'));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use(express.static(path.join(__dirname,"..","client/dist")));

app.use((req,res,next) =>{
    const auth = req.headers.authorization;
    const token = auth?.startsWith("Bearer ")? auth.slice(7) : null;

    try{
        req.user = jwt.verify(token,process.env.JWT);
    }catch(e){
        req.user = null;
    }

    next();
})

app.get('/',(req,res)=>{
    res.send("Hello from App")
})


app.use("/auth",require('./auth'));
app.use("/api",require('./api'))


module.exports = app;