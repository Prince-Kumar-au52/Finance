const express = require('express');
const app = express();
let cors = require("cors");
require('dotenv').config()
const allRouters = require('./api/routers/routeIndex');
const fileUpload = require("express-fileupload");
var indexRouter = require('./api/routers/index');
const cron = require("node-cron");
const axios = require("axios")
 
const path = require('path');
const { connectDB } = require('./db/db');


// db 
// Connect to MongoDB
connectDB().catch(err => {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  });
app.use(fileUpload({
    useTempFiles:true
  }))
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use(cors());
// app.options("*", cors());
// app.use(cors({ origin: "https://radiant-hamster-6f8234.netlify.app" }));

//routes
app.use("/v1", allRouters);
app.use('/', indexRouter);

cron.schedule('*/15 * * * *', async () => {
  try {
    const response = await axios.get('https://finance-075c.onrender.com/v1/dummy/getDummy');
    console.log("API call successful:", response.data);
  } catch (error) {
    console.error("Error making API call:", error.message);
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));








