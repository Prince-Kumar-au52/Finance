var express = require('express');
var router = express.Router();
var store = require('store');
var axios = require('axios');
var sha256 = require('sha256');
var uniqid = require('uniqid');
var bodyParser = require('body-parser');

// Use body-parser middleware to parse request bodies
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// PAY Route
router.get("/pay", async function (req, res, next) {
  let amount = req.query.amount;
  if (!amount) {
    return res.status(400).send({ error: 'Amount is required', success: false });
  }

  let tx_uuid = uniqid();
  store.set("uuid", { tx: tx_uuid });

  let normalPayLoad = {
    merchantId: "M110NES2UDXSUAT",
    merchantTransactionId: tx_uuid,
    merchantUserId: "MUID123",
    amount: amount * 100,
    redirectUrl: "http://localhost:5000/pay-return-url",
    redirectMode: "POST",
    callbackUrl: "http://localhost:5000/pay-return-url",
    mobileNumber: "9999999999",
    paymentInstrument: {
      type: "PAY_PAGE",
    },
  };

  let saltKey = "5afb2d8c-5572-47cf-a5a0-93bb79647ffa";
  let saltIndex = 1;

  let bufferObj = Buffer.from(JSON.stringify(normalPayLoad), "utf8");
  let base64String = bufferObj.toString("base64");

  let string = base64String + "/pg/v1/pay" + saltKey;
  let sha256_val = sha256(string);
  let checksum = sha256_val + "###" + saltIndex;

  axios.post("https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay", {
    request: base64String,
  }, {
    headers: {
      "Content-Type": "application/json",
      "X-VERIFY": checksum,
      accept: "application/json",
    },
  })
  .then(function (response) {
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

// PAY RETURN Route
router.post('/pay-return-url', async function (req, res) {
  const { code, merchantId, transactionId, providerReferenceId, amount } = req.body;
  console.log('Received callback data:', req.body);

  if (code === 'PAYMENT_SUCCESS' && merchantId && transactionId && providerReferenceId) {
    let saltKey = '5afb2d8c-5572-47cf-a5a0-93bb79647ffa';
    let saltIndex = 1;
    let surl = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${transactionId}`;
    let string = `/pg/v1/status/${merchantId}/${transactionId}${saltKey}`;
    let sha256_val = sha256(string);
    let checksum = sha256_val + '###' + saltIndex;

    const options = {
      method: 'get',
      url: surl,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'X-MERCHANT-ID': merchantId,
      },
    };

    axios.request(options)
      .then(function (response) {
        res.json({
          success: true,
          message: "Payment verification successful",
          data: response.data
        });
      })
      .catch(function (error) {
        console.error('Verification failed:', error);
        res.status(500).json({
          success: false,
          message: "Payment verification failed",
          error: error.message
        });
      });
  } else {
    res.status(400).json({
      success: false,
      message: "Payment failed or missing required parameters"
    });
  }
});

module.exports = router;
