const constants = require("../../helper/constants");
const UPIDetail = require("../../models/upiId");

exports.addUPIDetail = async (req, res) => {
  try {
    const { UpiId } = req.body;

    const existingBank = await UPIDetail.findOne({ UpiId });
    if (existingBank) {
      return res
      .status(constants.status_code.header.server_error)
        .send({ error: 'UPI ID must be unique', success: false });
    }
    const existingUserUPI = await UPIDetail.findOne({ CreatedBy: req.user._id });
    if (existingUserUPI) {
      return res
        .status(constants.status_code.header.server_error)
        .send({ Error: 'User has already added a UPI ID', success: false });
    }
    req.body.CreatedBy = req.user._id;
    req.body.UpdatedBy = req.user._id;
    const upi = await UPIDetail.create(req.body);
    return res
      .status(constants.status_code.header.ok)
      .send({ message: constants.curd.add, success: true });
  } catch (error) {
    return res
      .status(constants.status_code.header.server_error)
      .send({ error: error.message, success: false });
  }
};

exports.getAllUPIDetail= async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const pageNumber = parseInt(page) || 1;
    const size = parseInt(pageSize) || 10;
    const search = req.query.search || '';
       
    const searchQuery = {
      IsDeleted: false,
      
    };

    const totalCount = await UPIDetail.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalCount / size);

    const records = await UPIDetail.find(searchQuery)
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

exports.getUPIDetailById = async (req, res) => {
  try {
    const upi = await UPIDetail.findById(req.params.id);
    if (!upi) {
      return res
        .status(404)
        .json({ error: "UPIDetail not found", success: false });
    }
    return res
      .status(constants.status_code.header.ok)
      .send({ statusCode: 200, data: upi, success: true });
  } catch (error) {
    return res
      .status(constants.status_code.header.server_error)
      .send({ statusCode: 500, error: error.message, success: false });
  }
};
exports.getUPIDetailByUserId = async (req, res) => {
  try {
    const upi = await UPIDetail.findOne({ CreatedBy: req.params.id });
    if (!upi) {
      return res
        .status(404)
        .json({ error: "UPIDetail not found", success: false });
    }
    return res
      .status(200)
      .send({ statusCode: 200, data: upi, success: true });
  } catch (error) {
    return res
      .status(500)
      .send({ statusCode: 500, error: error.message, success: false });
  }
};


exports.updateUPIDetail = async (req, res) => {
  try {
    const upi = await UPIDetail.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!upi) {
      return res
        .status(404)
        .json({ error: "UPIDetail not found", success: false });
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
exports.updateUPIDetailByUser = async (req, res) => {
  try {
    const upi = await UPIDetail.findOneAndUpdate(
      { CreatedBy: req.params.id },
      req.body,
      { new: true }
    );
    if (!upi) {
      return res
        .status(404)
        .json({ error: "UPIDetail not found", success: false });
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
exports.deleteUPIDetail = async (req, res) => {
  try {
    const upi = await UPIDetail.findByIdAndUpdate(req.params.id, {
      IsDeleted: true,
    });
    if (!upi) {
      return res
        .status(404)
        .json({ error: "UPIDetail not found", success: false });
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

 
