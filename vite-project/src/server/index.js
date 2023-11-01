const app = require('./app');
require("dotenv").config();

const PORT = process.env.PORT || 3000;

app.listen(PORT,(req,res)=>{
    console.log("The server listening on port "+PORT)
})