const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router()

const { registerSchema ,loginSchema}  = require('../validators/authValidator');
const { validate } = require('../../helper/customValidation');
const { getRecordsSchema, idSchema } = require('../validators/commonValidator');

router.post('/register',validate(registerSchema,'body'),authController.register)
router.post('/login',authController.login);
router.get('/allUser',validate(getRecordsSchema,'query'),authController.getAllUser)
router.get('/user/:id',validate(idSchema,'params'),authController.getUserId)
router.patch('/updateUser/:id',validate(idSchema,'params'),authController.updateUser)
router.delete('/deleteUser/:id',validate(idSchema,'params'),authController.deleteUser)
router.get("/totalUser",authController.totalUser)

 

module.exports = router