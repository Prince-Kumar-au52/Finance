const express = require('express')
const authController = require('../controllers/authController')
const router = express.Router()

const { registerSchema ,loginSchema}  = require('../validators/authValidator');
const { validate } = require('../../helper/customValidation');

router.post('/register',validate(registerSchema,'body'),authController.register)
router.post('/login',authController.login)

 

module.exports = router