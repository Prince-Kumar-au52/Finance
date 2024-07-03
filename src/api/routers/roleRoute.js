const express = require('express')
 
const router = express.Router()
const { validate } = require('../../helper/customValidation');
 
 
const auth = require('../middleware/auth');
// const { roleSchema} = require('../validators/authValidator');
const { addRole, getAllRole, updateRole, deleteRole } = require('../controllers/roleController');
// const { idSchema } = require('../validators/commonValidator');
// const { authToken } = require('../../helper/config');

router.post('/addRole',addRole)
router.get('/allRole',auth,getAllRole)
router.patch('/updateRole/:id',auth,updateRole)
router.delete('/deleteRole/:id',auth,deleteRole)
 

module.exports = router