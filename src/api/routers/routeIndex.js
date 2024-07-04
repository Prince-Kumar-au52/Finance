const express = require('express');

const authRoutes = require('./authRoute');
const roleRoutes = require('./roleRoute');
const bankRoutes = require('./bankDetail');
const upiRoutes = require('./upiRoute')

const allRouters = express.Router();

allRouters.use("/auth", authRoutes);
allRouters.use("/role", roleRoutes);
allRouters.use("/bankDetail", bankRoutes);
allRouters.use("/upiDetail", upiRoutes);
module.exports =  allRouters;