const constants = require("../../helper/constants");
const UPIDetail = require("../../models/upiId");
const User = require("../../models/userModel");
const Withdrow = require("../../models/withdrow");

exports.addWithdrow = async (req, res) => {
  try {
   
    req.body.CreatedBy = req.user._id;
    req.body.UpdatedBy = req.user._id;
    const withdrow = await Withdrow.create(req.body);
    return res
      .status(constants.status_code.header.ok)
      .send({ message: constants.curd.add, success: true });
  } catch (error) {
    return res
      .status(constants.status_code.header.server_error)
      .send({ error: error.message, success: false });
  }
};

exports.getAllWithdrow = async (req, res) => {
  try {
    const { page, pageSize, search = '', type = '' } = req.query;
    const pageNumber = parseInt(page) || 1;
    const size = parseInt(pageSize) || 10;

    // Construct the search query
    const searchQuery = { IsDeleted: false };
    
    if (type === 'pending') {
      searchQuery.IsCompleted = false;
      searchQuery.IsRejected = false;
      searchQuery.$or = [{ IsVerify: false }, { IsVerify: true }];
    } 
    if (type === 'rejected') {
      searchQuery.IsRejected = true;
    } 
    if (type === 'completed') {
      searchQuery.IsVerify = true;
      searchQuery.IsCompleted = true;
    }

    if (search) {
      searchQuery.$or = [
        { Amount: { $regex: search, $options: 'i' } },
        // Add more fields for searching if required
      ];
    }

    // Count total documents matching the search query
    const totalCount = await Withdrow.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalCount / size);

    // Fetch records with pagination and sorting
    const records = await Withdrow.find(searchQuery)
      .populate('CreatedBy')
      .sort({ CreatedDate: -1 }) // Ensure CreatedDate is a valid date field
      .skip((pageNumber - 1) * size)
      .limit(size);

    const userIds = records.map(record => record.CreatedBy._id);
    const upiDetails = await UPIDetail.find({ CreatedBy: { $in: userIds } });

    // Map UPI details to the corresponding users
    const userUpiMap = upiDetails.reduce((acc, upiDetail) => {
      acc[upiDetail.CreatedBy] = upiDetail.UpiId;
      return acc;
    }, {});

    // Attach UPI details to each record
    const recordsWithUpi = records.map(record => ({
      ...record.toObject(),
      UpiId: userUpiMap[record.CreatedBy._id] || null,
    }));

    return res.status(constants.status_code.header.ok).send({
      statusCode: 200,
      data: recordsWithUpi,
      success: true,
      totalCount,
      count: recordsWithUpi.length,
      pageNumber,
      totalPages,
    });
  } catch (error) {
    return res.status(constants.status_code.header.server_error).send({
      statusCode: 500,
      error: error.message,
      success: false,
    });
  }
};


exports.getWithdrowById = async (req, res) => {
  try {
    const withdrow = await Withdrow.findById(req.params.id);
    if (!withdrow) {
      return res
        .status(404)
        .json({ error: "Withdrow not found", success: false });
    }
    return res
      .status(constants.status_code.header.ok)
      .send({ statusCode: 200, data: withdrow, success: true });
  } catch (error) {
    return res
      .status(constants.status_code.header.server_error)
      .send({ statusCode: 500, error: error.message, success: false });
  }
};

exports.updateWithdrow = async (req, res) => {
  try {
    const withdrow = await Withdrow.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!withdrow) {
      return res
        .status(404)
        .json({ error: "Withdrow not found", success: false });
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

exports.deleteWithdrow = async (req, res) => {
  try {
    const withdrow = await Withdrow.findByIdAndUpdate(req.params.id, {
      IsDeleted: true,
    });
    if (!withdrow) {
      return res
        .status(404)
        .json({ error: "Withdrow not found", success: false });
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

exports.getWithdrowForUser = async (req, res) => {
  try {
    const id = req.user._id
    const withdrow = await Withdrow.find({CreatedBy:id});
    if (!withdrow) {
      return res
        .status(404)
        .json({ error: "Withdrow not found", success: false });
    }
    return res
      .status(constants.status_code.header.ok)
      .send({ statusCode: 200, data: withdrow, success: true });
  } catch (error) {
    return res
      .status(constants.status_code.header.server_error)
      .send({ statusCode: 500, error: error.message, success: false });
  }
};
exports.getAllWithdrowCompleted = async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const pageNumber = parseInt(page) || 1;
    const size = parseInt(pageSize) || 10;
    const search = req.query.search || '';

    // Construct the search query
    const searchQuery = {
      IsDeleted: false,
      IsVerify:true,
      IsComleted:true
      // ...(search && {
      //   $or: [
      //     { Amount: { $regex: search, $options: 'i' } }, // Adjust this field as needed
      //     // Add more fields for searching if required
      //   ]
      // })
    };

    // Count total documents matching the search query
    const totalCount = await Withdrow.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalCount / size);

    // Fetch records with pagination and sorting
    const records = await Withdrow.find(searchQuery)
      .populate('CreatedBy')
      .sort({ CreatedDate: -1 }) // Ensure CreatedDate is a valid date field
      .skip((pageNumber - 1) * size)
      .limit(size);
      const userIds = records.map(record => record.CreatedBy._id);
      const upiDetails = await UPIDetail.find({ CreatedBy: { $in: userIds } })
      
    return res.status(constants.status_code.header.ok).send({
      statusCode: 200,
      data: records,
      UpiId: upiDetails[0].UpiId,
      success: true,
      totalCount,
      count: records.length,
      pageNumber,
      totalPages,
    });
  } catch (error) {
    return res.status(constants.status_code.header.server_error).send({
      statusCode: 500,
      error: error.message,
      success: false,
    });
  }
};