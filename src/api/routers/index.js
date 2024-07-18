var express = require('express');
var router = express.Router();
//++++++++++++++++++++++++++++++++++++++++++++++++++++++
var store = require('store');
var axios = require('axios');
var sha256 = require('sha256');
var uniqid = require('uniqid');
//++++++++++++++++++++++++++++++++++++++++++++++++++++++
/* GET home page. */
//++++++++++++++++++++++++++++++++++++++++++++++++++++++
// router.get('/', async function (req, res, next) {
//   res.render('index', { page_respond_data: 'Please Pay & Repond From The Payment Gateway Will Come In This Section' });
// });
//++++++++++++++++++++++++++++++++++++++++++++++++++++++
//PAY
//++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.get("/pay", async function (req, res, next) {
  Example: amount = req.query.amount;
  if (!amount) {
    return res.status(400).send({ error: 'Amount is required', success: false });
      // .send('Amount is required');
  }

  // Store transaction UUID
  let tx_uuid = uniqid();
  store.set("uuid", { tx: tx_uuid });

  // Payload for PhonePe API
  let normalPayLoad = {
    merchantId: "M110NES2UDXSUAT",
    merchantTransactionId: tx_uuid,
    merchantUserId: "MUID123",
    amount:amount*100,
    redirectUrl: "https://finance-075c.onrender.com/pay-return-url/",
    redirectMode: "POST",
    callbackUrl: "https://finance-075c.onrender.com/pay-return-url/",
    mobileNumber: "9999999999",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  let saltKey = "5afb2d8c-5572-47cf-a5a0-93bb79647ffa";
  let saltIndex = 1;

  // Encode payload to Base64
  let bufferObj = Buffer.from(JSON.stringify(normalPayLoad), "utf8");
  let base64String = bufferObj.toString("base64");

  // Create checksum
  let string = base64String + "/pg/v1/pay" + saltKey;
  let sha256_val = sha256(string);
  let checksum = sha256_val + "###" + saltIndex;

  // Make API request to PhonePe
  axios
    .post(
      "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay",
      {
        request: base64String,
      },
      {
        headers: {
          "Content-Type": "application/json",
          "X-VERIFY": checksum,
          accept: "application/json",
        },
      }
    )
    .then(function (response) {
      // Redirect the user to the PhonePe payment page
      res.json({
        success: true,
        message: "Redirecting to PhonePe",
        redirectUrl: response.data.data.instrumentResponse.redirectInfo.url,
      });
    })
    .catch(function (error) {
      res.status(500).json({
        success: false,
        message: "Payment initiation failed",
        error: error.message,
      });
    });
});
//++++++++++++++++++++++++++++++++++++++++++++++++++++++
//PAY RETURN
//++++++++++++++++++++++++++++++++++++++++++++++++++++++
router.all('/pay-return-url', async function (req, res) {
  if (req.body.code == 'PAYMENT_SUCCESS' && req.body.merchantId && req.body.transactionId && req.body.providerReferenceId) {
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // 1.In the live please match the amount you get byamount you send also so that hacker can't pass static value.
    // 2.Don't take Marchent ID directly validate it with yoir Marchent ID
    //++++++++++++++++++++++++++++++++++++++++++++++++++++++
    //if (req.body.transactionId == store.get('uuid').tx && req.body.merchantId == 'PGTESTPAYUAT' && req.body.amount == 1000) {
    if (req.body.transactionId) {
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++
      let saltKey = '5afb2d8c-5572-47cf-a5a0-93bb79647ffa';
      let saltIndex = 1
      //++++++++++++++++++++++++++++++++++++++++++++++++++++++
      let surl = 'https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/PGTESTPAYUAT/' + req.body.transactionId;
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++
      let string = '/pg/v1/status/PGTESTPAYUAT/' + req.body.transactionId + saltKey;
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++
      let sha256_val = sha256(string);
      let checksum = sha256_val + '###' + saltIndex;
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++
      //console.log(checksum);
      //+++++++++++++++++++++++++++++++++++++++++++++++++++++
      axios.get(surl, {
        headers: {
          'Content-Type': 'application/json',
          'X-VERIFY': checksum,
          'X-MERCHANT-ID': req.body.transactionId,
          'accept': 'application/json'
        }
      }).then(function (response) {
        //+++++++++++++++++++++++++++++++++++++++++++++++++
        //DB OPERATION
        //+++++++++++++++++++++++++++++++++++++++++++++++++
        //{PLease add your code.}
        //+++++++++++++++++++++++++++++++++++++++++++++++++
        //RETURN TO VIEW
        //+++++++++++++++++++++++++++++++++++++++++++++++++
        //console.log(response);
        res.render('index', { page_respond_data: JSON.stringify(response.data) });
      }).catch(function (error) {
        res.render('index', { page_respond_data: JSON.stringify(error) });
      });
    } else {
      res.render('index', { page_respond_data: "Sorry!! Error1" });
    }
  } else {
    res.render('index', { page_respond_data: "Sorry!! Error2" });
  }
});
//++++++++++++++++++++++++++++++++++++++++++++++++++++++
module.exports = router;
//++++++++++++++++++++++++++++++++++++++++++++++++++++++
