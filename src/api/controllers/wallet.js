const constants = require("../../helper/constants");
const Wallet = require("../../models/wallet");
const withdrow = require("../../models/withdrow");

exports.addWallet = async (req, res) => {
  try {
    
    req.body.CreatedBy = req.user._id;
    req.body.UpdatedBy = req.user._id;
    const wallet = await Wallet.create(req.body);
    return res
      .status(constants.status_code.header.ok)
      .send({ message: constants.curd.add, success: true });
  } catch (error) {
    return res
      .status(constants.status_code.header.server_error)
      .send({ error: error.message, success: false });
  }
};

exports.getAllWallet = async (req, res) => {
  try {
    const { page, pageSize, search } = req.query;
    const pageNumber = parseInt(page) || 1;
    const size = parseInt(pageSize) || 10;
    const searchText = search || '';

    // Base search query
    const searchQuery = {
      IsDeleted: false,
    };

    // Fetch all records matching the base query and populate CreatedBy field
    let records = await Wallet.find(searchQuery)
      .sort({ CreatedDate: -1 })
      .populate('CreatedBy');

    // Filter records based on search text in CreatedBy.FullName
    if (searchText) {
      records = records.filter(record => 
        record.CreatedBy && record.CreatedBy.FullName.toLowerCase().includes(searchText.toLowerCase())
      );
    }

    // Calculate the total count of filtered records
    const totalCount = records.length;
    const totalPages = Math.ceil(totalCount / size);

    // Apply pagination to the filtered records
    const paginatedRecords = records.slice((pageNumber - 1) * size, pageNumber * size);

    return res.status(constants.status_code.header.ok).send({
      statusCode: 200,
      data: paginatedRecords,
      success: true,
      totalCount: totalCount,
      count: paginatedRecords.length,
      pageNumber: pageNumber,
      totalPages: totalPages,
    });
  } catch (error) {
    res.status(constants.status_code.header.server_error).send({
      statusCode: 500,
      error: error.message,
      success: false,
    });
  }
};




exports.getUPIWalletById = async (req, res) => {
  try {
    const wallet = await Wallet.findById(req.params.id).sort({ CreatedDate: -1 });
    if (!wallet) {
      return res
        .status(404)
        .json({ error: "Wallet not found", success: false });
    }
    return res
      .status(constants.status_code.header.ok)
      .send({ statusCode: 200, data: wallet, success: true });
  } catch (error) {
    return res
      .status(constants.status_code.header.server_error)
      .send({ statusCode: 500, error: error.message, success: false });
  }
};

exports.updateWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!wallet) {
      return res
        .status(404)
        .json({ error: "Wallet not found", success: false });
    }
    res
      .status(constants.status_code.header.ok)
      .send({ statusCode: 200, message: constants.curd.update, success: true });
  } catch (error) {
    return res
      .status(constants.status_code.header.server_error)
      .send({ statusCode: 500, error: error.message, success: false });
  }
};

exports.deleteWallet = async (req, res) => {
  try {
    const wallet = await Wallet.findByIdAndUpdate(req.params.id, {
      IsDeleted: true,
    });
    if (!wallet) {
      return res
        .status(404)
        .json({ error: "Wallet not found", success: false });
    }
    res
      .status(constants.status_code.header.ok)
      .send({ statusCode: 200, message: constants.curd.delete, success: true });
  } catch (error) {
    return res
      .status(constants.status_code.header.server_error)
      .send({ statusCode: 500, error: error.message, success: false });
  }
};

exports.getUserMoney = async (req, res) => {
    try {
        // Query to find all wallet records created by the user
        const walletRecords = await Wallet.find({ CreatedBy: req.user._id, IsDeleted: false });
        
        // Calculate the total money in the wallet
        const totalMoney = walletRecords.reduce((sum, record) => sum + record.Amount, 0);

        // Query to find all withdrawal records created by the user
        const withdrawalRecords = await withdrow.find({ CreatedBy: req.user._id, IsDeleted: false,IsComleted:true });
        // Calculate the total money withdrawn
        const totalWithdrawn = withdrawalRecords.reduce((sum, record) => sum + record.Amount, 0);

        // Calculate the remaining money in the wallet
        const remainingMoney = totalMoney - totalWithdrawn;

        // Send the response with the calculated amounts
        return res.status(constants.status_code.header.ok).send({
            statusCode: 200,
            success: true,
            data: {
                totalMoney,
                totalWithdrawn,
                remainingMoney
            }
        });
    } catch (error) {
        // Handle errors and send error response
        return res.status(constants.status_code.header.server_error).send({
            statusCode: 500,
            error: error.message,
            success: false
        });
    }
};

exports.getWalletForUser = async (req, res) => {
  try {
    const id = req.user._id
    const wallet = await Wallet.find({CreatedBy:id}).sort({ CreatedDate: -1 });
    if (!wallet) {
      return res
        .status(404)
        .json({ error: "Withdrow not found", success: false });
    }
    return res
      .status(constants.status_code.header.ok)
      .send({ statusCode: 200, data: wallet, success: true });
  } catch (error) {
    return res
      .status(constants.status_code.header.server_error)
      .send({ statusCode: 500, error: error.message, success: false });
  }
};
