const express = require('express');
const app = express();
let cors = require("cors");
require('dotenv').config()
const allRouters = require('./api/routers/routeIndex');
const fileUpload = require("express-fileupload");
var indexRouter = require('./api/routers/index');
 
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
app.use(cors({ origin: "https://radiant-hamster-6f8234.netlify.app" }));

//routes
app.use("/v1", allRouters);
app.use('/', indexRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));








