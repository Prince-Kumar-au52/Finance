const express = require('express')
 
const router = express.Router()

 
const { validate } = require('../../helper/customValidation');

const auth = require('../middleware/auth');
const { getRecordsSchema, idSchema } = require('../validators/commonValidator');

const { upiSchema } = require('../validators/upiValidator');
const { addWithdrow, getAllWithdrow, getWithdrowById, updateWithdrow, deleteWithdrow, getWithdrowForUser, getAllWithdrowCompleted } = require('../controllers/withdrow');
const { withdrowSchema } = require('../validators/withdrow');

router.post('/addWithdrow',auth,validate(withdrowSchema,'body'),addWithdrow)
router.get('/allWithdrow',validate(getRecordsSchema,'query'),getAllWithdrow);
router.get('/Withdrow/:id',auth,validate(idSchema,'params'),getWithdrowById);
router.patch('/updateWithdrow/:id',validate(idSchema,'params'),updateWithdrow);
router.delete('/deleteWithdrow/:id',auth,validate(idSchema,'params'),deleteWithdrow);
router.get('/getWithdrowforUser',auth,getWithdrowForUser);
router.get('/getWithdrowComplete',getAllWithdrowCompleted);



module.exports = router