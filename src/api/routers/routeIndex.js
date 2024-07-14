const express = require('express');

const authRoutes = require('./authRoute');
const roleRoutes = require('./roleRoute');
const bankRoutes = require('./bankDetail');
const upiRoutes = require('./upiRoute');
const withdrowRoutes =require('./withdrow');
const walletRoute =require('./wallet');
const bannerRoute = require('./bannerRoute')

const allRouters = express.Router();

allRouters.use("/auth", authRoutes);
allRouters.use("/role", roleRoutes);
allRouters.use("/bankDetail", bankRoutes);
allRouters.use("/upiDetail", upiRoutes);
allRouters.use("/withDrow",withdrowRoutes);
allRouters.use("/wallet",walletRoute);
allRouters.use("/banner",bannerRoute);
module.exports =  allRouters;