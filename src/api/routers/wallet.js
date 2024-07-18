const express = require('express')
 
const router = express.Router()

 
const { validate } = require('../../helper/customValidation');

const auth = require('../middleware/auth');
const { getRecordsSchema, idSchema } = require('../validators/commonValidator');
const { addWallet, getAllWallet, updateWallet, deleteWallet, getUserMoney } = require('../controllers/wallet');
const { getWithdrowById } = require('../controllers/withdrow');
const { walletSchema } = require('../validators/walletValidtion');


router.post('/addWallet',auth,validate(walletSchema,'body'),addWallet)
router.get('/allWallet',validate(getRecordsSchema,'query'),getAllWallet)
router.get('/Wallet/:id',auth,validate(idSchema,'params'),getWithdrowById)
router.patch('/updateWallet/:id',validate(idSchema,'params'),auth,updateWallet)
router.delete('/deleteWallet/:id',auth,validate(idSchema,'params'),deleteWallet);
router.get('/getMoney',auth,getUserMoney)


module.exports = router