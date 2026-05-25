const express = require('express')
const router = express.Router()

const {createUser, addBmiRecord, getAllUser, updateUser, deleteAllUser, getHistory} = require('../controller/userController')

router.post("/create-user", createUser);
router.post("/add-bmi-record/:user_id",addBmiRecord);
router.get('/',getAllUser)
router.put('/update/:id',updateUser)
router.delete('/deleteAll',deleteAllUser)
router.get('/getHistory/:id',getHistory)
module.exports = router;
