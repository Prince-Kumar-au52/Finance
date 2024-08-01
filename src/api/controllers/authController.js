const User = require("../../models/userModel");
const constants = require("../../helper/constants");
const bcrypt = require('bcryptjs')
const Role = require("../../models/roleModel");
const { errorResponse } = require("../../helper/responseTransformer");
const config = require('../../helper/config')
const jwt =require ('jsonwebtoken');
const withdrow = require("../../models/withdrow");
const wallet = require("../../models/wallet");
const crypto = require('crypto');


exports.register = async (req, res) => {
  try {
    const { Role: role, Password: password,  ...restBody } = req.body;
 
    // Find role by name
    const roleId = await Role.findOne({ Role: role });
    if (!roleId) {
      return res.status(constants.status_code.header.ok).send({
        statusCode: 200,
        error: "Role does not exist in DB",
        success: false
      });
    }

    // Generate a unique referral code
    let referralCode;
    let codeExists;
    do {
      const namePart = req.body.FullName.replace(/\s+/g, '').substring(0, 2).toUpperCase();
      const randomPart = crypto.randomInt(1000, 10000).toString();
      referralCode = `${namePart}${randomPart}`;
      codeExists = await User.findOne({ referralCode });
    } while (codeExists);

    // Hash the password
    // const saltRounds = 10;
    // const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user with hashed password and roles
    const user = new User({
      ...restBody,
      Password: password, // Use hashedPassword if hashing is enabled
      Roles: [roleId._id],
      ReferalCode: referralCode
    });

    // Save user to the database
    await user.save();

    return res.status(constants.status_code.header.ok).send({
      message: constants.auth.register_success,
      success: true
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(constants.status_code.header.server_error).send({
      error: errorResponse(error),
      success: false
    });
  }
};


exports.login = async (req, res) => {
  try {
    const { EmailId, Password } = req.body;

    if (!EmailId || !Password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and Password are required' 
      });
    }

    // Find user by EmailId
    const user = await User.findOne({ EmailId }).populate('Roles');

    // Check if user exists and validate password
    // if (!user || !(await bcrypt.compare(Password, user.Password))) {
      if (!user || !(Password === Password)) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid Email or Password' 
      });
    }

    // Extract user roles
    const userRoles = user.Roles.map(role => role.Role);

    // Generate JWT token
    const token = jwt.sign({ _id: user._id, roles: userRoles }, config.JWT_KEY, { expiresIn: '30d' });

    // Send token and user info in response
    res.status(constants.status_code.header.ok).json({
      success: true,
      message: 'Login successful',
      token,
      userId: user._id,
      fullName: user.FullName,
      roles: userRoles
    });
  } catch (error) {
    return res.status(constants.status_code.header.server_error).json({ 
      success: false, 
      error: error.message 
    });
  }
};
exports.totalUser= async (req, res) => {
  try {
    
    const user = await User.find({IsDeleted:false})
    const withdrowData = await withdrow.find({IsDeleted:false})
    const withdrowRejected = await withdrow.find({IsDeleted:false,IsRejected:true,})
    const withdrawPending = await withdrow.find({
      IsDeleted: false,
      IsComleted: false,
      IsRejected:false,
      $or: [
          
          
          {IsVerify:false},
          {IsVerify:true},

      ],
  });
    const withdrowComplete = await withdrow.find({IsDeleted:false,IsVerify:true,IsComleted:true})
    const wallets = await wallet.find({ IsDeleted: false });
    const totalWalletMoney = wallets.reduce((sum, wallet) => sum + wallet.Amount, 0);

    // Calculate the total amount of money withdrawn
    const totalWithdrawnMoney = withdrowData.reduce((sum, withdrawal) => sum + withdrawal.Amount, 0);
    const remainMoney = totalWalletMoney - totalWithdrawnMoney
    return res.status(constants.status_code.header.ok).send({
      userCount:user.length,
      withdrowData:withdrowData.length,
      withdrowComplete:withdrowComplete.length,
      withdrowPending:withdrawPending.length,
      withdrowRejected:withdrowRejected.length,
      totalWalletMoney:totalWalletMoney,
      totalWithdrawnMoney:totalWithdrawnMoney,
      remainMoney:remainMoney,
      success: true
    });
  } catch (error) {
    console.error('Error registering user:', error);
    return res.status(constants.status_code.header.server_error).send({
      error: errorResponse(error),
      success: false
    });
  }
};

exports.getAllUser= async (req, res) => {
  try {
    const { page, pageSize } = req.query;
    const pageNumber = parseInt(page) || 1;
    const size = parseInt(pageSize) || 10;
    const search = req.query.search || '';
       
    const searchQuery = {
      IsDeleted: false,
      $or: [
        { FullName: { $regex: search, $options: 'i' } }, 
    ]  
    };

    const totalCount = await User.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalCount / size);

    const records = await User.find(searchQuery)
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

exports.getUserId = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found", success: false });
    }
    return res
      .status(constants.status_code.header.ok)
      .send({ statusCode: 200, data: user, success: true });
  } catch (error) {
    return res
      .status(constants.status_code.header.server_error)
      .send({ statusCode: 500, error: error.message, success: false });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found", success: false });
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

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, {
      IsDeleted: true,
    });
    if (!user) {
      return res
        .status(404)
        .json({ error: "User not found", success: false });
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

 
