const express = require('express');

const authRoutes = require('./authRoute');
const roleRoutes = require('./roleRoute');
const bankRoutes = require('./bankDetail');

const allRouters = express.Router();

allRouters.use("/auth", authRoutes);
allRouters.use("/role", roleRoutes);
allRouters.use("/bankDetail", bankRoutes);
module.exports =  allRouters;