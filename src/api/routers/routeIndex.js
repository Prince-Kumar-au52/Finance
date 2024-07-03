const express = require('express');

const authRoutes = require('./authRoute');
const roleRoutes = require('./roleRoute');

const allRouters = express.Router();

allRouters.use("/auth", authRoutes);
allRouters.use("/role", roleRoutes);
module.exports =  allRouters;