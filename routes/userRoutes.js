const express = require('express')
const router = express.Router()

const {createUser, 
    addBmiRecord, 
    getAllUser, 
    updateUser,  
    getHistory , 
    deleteHistory} = require('../controller/userController')

router.post("/create-user", createUser);
router.post("/add-bmi-record/:user_id",addBmiRecord);
router.get('/',getAllUser);
router.put('/update/:id',updateUser);
router.get('/getHistory/:id',getHistory);
router.delete('/deleteHistory/:id',deleteHistory);
module.exports = router;
