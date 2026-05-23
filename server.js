const express = require('express')
const cors = require('cors')
const router = require('./routes/userRoutes')


const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/user',router)

app.listen(5000,(req,res)=>{
    console.log("Server is running on 5000")
})