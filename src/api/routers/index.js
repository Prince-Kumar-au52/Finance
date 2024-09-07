const express = require('express');
const router = express.Router();
const store = require('store');
const axios = require('axios');
const sha256 = require('sha256');
const uniqid = require('uniqid');
const bodyParser = require('body-parser');
const Payment = require('../../models/wallet'); // Import the Payment model
const auth = require('../middleware/auth'); // Import the authentication middleware
const cron = require('node-cron'); // Import node-cron

// Use body-parser middleware to parse request bodies
router.use(bodyParser.json());
router.use(bodyParser.urlencoded({ extended: true }));

// In-memory map to store user-specific cron jobs
const userCronJobs = new Map();

// PAY Route
router.get("/pay", auth, async function (req, res, next) {
  let amount = req.query.amount;
  if (!amount) {
    return res.status(400).send({ error: 'Amount is required', success: false });
  }
  if (amount < 500) {
    return res
      .status(400)
      .send({ statusCode: 400, error: 'Amount should not be less than 500', success: false });
  }
  
  let tx_uuid = uniqid();
  store.set("uuid", { tx: tx_uuid });

  const userID = req.user._id;
  let normalPayLoad = {
    merchantId: "M110NES2UDXSUAT",
    merchantTransactionId: tx_uuid,
    merchantUserId: userID, // Use authenticated user's ID
    amount: amount * 100,
    redirectUrl: `https://finance-075c.onrender.com/pay-return-url?UserId=${userID}`,
    redirectMode: "POST",
    callbackUrl: `https://finance-075c.onrender.com/pay-return-url?UserId=${userID}`,
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
  const userId = req.query.UserId;

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

    try {
      const response = await axios.request(options);

      // Save the payment return response in the database
      const payment = new Payment({
        code,
        merchantId,
        transactionId,
        providerReferenceId,
        Amount: amount / 100,
        response: response.data,
        CreatedBy: userId,
        UpdatedBy: userId,
      });

      await payment.save();

      // Schedule periodic API calls using cron
      scheduleApiCalls(userId);

      res.json({
        success: true,
        message: "Payment verification successful",
      });

    } catch (error) {
      console.error('Verification failed:', error);
      res.status(500).json({
        success: false,
        message: "Payment verification failed",
        error: error.message,
      });
    }
  } else {
    res.status(400).json({
      success: false,
      message: "Payment failed or missing required parameters"
    });
  }
});

// Function to call the API
function callApi(userId) {
  const apiUrl = `https://finance-075c.onrender.com/v1/referal/addReferalDetail/${userId}`;

  axios.post(apiUrl, 
    { userId: userId }, 
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  )
  .then(response => {
    console.log('API called successfully:', response.data);
  })
  .catch(error => {
    console.error('Error calling API:', error);
  });
}

// Function to schedule periodic API calls using cron (every 30 seconds)
function scheduleApiCalls(userId) {
  // Check if a job for this user already exists
  if (userCronJobs.has(userId)) {
    console.log(`Cron job for user ${userId} is already scheduled.`);
    return;
  }

  // Schedule a new cron job to run every 23 hours 59 minutes
  const job = cron.schedule('59 23 * * *', () => {
    callApi(userId);
  }, {
    timezone: "Asia/Kolkata", // Set the timezone to India
  });

  // Store the job in the map
  userCronJobs.set(userId, job);

  console.log(`Scheduled new cron job for user ${userId}, updating every 30 seconds.`);
}

module.exports = router;
