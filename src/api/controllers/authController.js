const User = require("../../models/userModel");
const constants = require("../../helper/constants");
const bcrypt = require('bcryptjs')
const Role = require("../../models/roleModel");
const { errorResponse } = require("../../helper/responseTransformer");
const config = require('../../helper/config')
const jwt =require ('jsonwebtoken');

// Register an user
exports.register = async (req, res) => {
    try {
      const { Role: role, Password: Password, ...restBody } = req.body;
  
      // Find role by name
      const roleId = await Role.findOne({ Role: role });
      if (!roleId) {
        return res.status(constants.status_code.header.ok).send({
          statusCode: 200,
          error: "Role does not exist in DB",
          success: false
        });
      }
  
      // Hash the password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(Password, saltRounds);
  
      // Create new user with hashed password and roles
      const user = new User({ ...restBody, Password: hashedPassword, Roles: [roleId._id] });
  
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
    if (!user || !(await bcrypt.compare(Password, user.Password))) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid Email or Password' 
      });
    }

    // Extract user roles
    const userRoles = user.Roles.map(role => role.Role);

    // Generate JWT token
    const token = jwt.sign({ _id: user._id, roles: userRoles }, config.JWT_KEY, { expiresIn: '1h' });

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
