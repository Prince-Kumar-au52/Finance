const constants = require("../../helper/constants");
const Referal = require("../../models/referal");
const Wallet = require("../../models/wallet");
 

exports.addReferal = async (req, res) => {
    try {
      // Find the user's wallet
      const wallet = await Wallet.findOne({ CreatedBy: req.user._id });
      if (!wallet) {
        return res.status(constants.status_code.header.not_found).send({
          statusCode: 404,
          error: "Wallet not found",
          success: false,
        });
      }
  
      // Calculate 5% of the wallet amount
      const points = wallet.Amount * 0.05;
  
      // Create the referral with the points
      const referalData = {
        ...req.body,
        Point: points,
        CreatedBy:req.user._id 
      };
      const referal = await Referal.create(referalData);
  
      return res.status(constants.status_code.header.ok).send({
        message: constants.curd.add,
        success: true,
      });
    } catch (error) {
      return res.status(constants.status_code.header.server_error).send({
        error: error.message,
        success: false,
      });
    }
  };
  