const express = require('express')
const router = express.Router()

const {createUser, addBmiRecord, getAllUser, updateUser, deleteAllUser} = require('../controller/userController')

router.post("/create-user", createUser);
router.post("/add-bmi-record/:user_id",addBmiRecord);
router.get('/',getAllUser)
router.put('/update/:id',updateUser)
router.delete('/deleteAll',deleteAllUser)
module.exports = router;
