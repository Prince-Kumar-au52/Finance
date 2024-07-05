const constants = require("../../helper/constants");
const BankDetail = require("../../models/bankDetail");

exports.addBankDetail = async (req, res) => {
  try {
    const { AccNumber } = req.body;

    const existingBank = await BankDetail.findOne({ AccNumber });
    if (existingBank) {
      return res
        .status(constants.status_code.header.conflict) // 409 Conflict
        .send({ message: 'AccNumber must be unique', success: false });
    }
    req.body.CreatedBy = req.user._id;
    req.body.UpdatedBy = req.user._id;
    const bank = await BankDetail.findOne({AccNumber});

    return res
      .status(constants.status_code.header.ok)
      .send({ message: constants.curd.add, success: true });
  } catch (error) {
    return res
      .status(constants.status_code.header.server_error)
      .send({ error: error.message, success: false });
  }
};

exports.getAllBankDetail= async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const pageNumber = parseInt(page) || 1;
    const size = parseInt(pageSize) || 10;
    const search = req.query.search || '';
       
    const searchQuery = {
      IsDeleted: false,
      
    };

    const totalCount = await BankDetail.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalCount / size);

    const records = await BankDetail.find(searchQuery)
      .sort({ CreatedDate: -1 })
      .skip((pageNumber - 1) * size)
      .limit(size)
      ;
    return res.status(constants.status_code.header.ok).send({
      statusCode: 200,
      data: records,
      success: true,
      totalCount: totalCount,
      count: records.length,
      pageNumber: pageNumber,
      totalPages: totalPages,
    });
  } catch (error) {
    res
      .status(constants.status_code.header.server_error)
      .send({ statusCode: 500, error: error.message, success: false });
  }
};

exports.getBankDetailById = async (req, res) => {
  try {
    const bank = await BankDetail.findById(req.params.id);
    if (!bank) {
      return res
        .status(404)
        .json({ error: "BankDetail not found", success: false });
    }
    return res
      .status(constants.status_code.header.ok)
      .send({ statusCode: 200, data: bank, success: true });
  } catch (error) {
    return res
      .status(constants.status_code.header.server_error)
      .send({ statusCode: 500, error: error.message, success: false });
  }
};

exports.updateBankDetail = async (req, res) => {
  try {
    const bank = await BankDetail.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!bank) {
      return res
        .status(404)
        .json({ error: "BankDetail not found", success: false });
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

exports.deleteBankDetail = async (req, res) => {
  try {
    const bank = await BankDetail.findByIdAndUpdate(req.params.id, {
      IsDeleted: true,
    });
    if (!bank) {
      return res
        .status(404)
        .json({ error: "BankDetail not found", success: false });
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

 
