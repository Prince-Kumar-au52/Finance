
const constants = require("../../helper/constants");
const Role = require("../../models/roleModel");
 

exports.addRole = async (req, res) => {
    try {
      
        const existRole = await Role.findOne({Role:req.body.Role})
        if(existRole){
            return res.status(400).send({success:false,error:"Role Already exist"})
        }
        
        const role = await Role.create(req.body);
       return res.status(constants.status_code.header.ok).send({ statusCode: 201, message: constants.curd.add, success: true });
    } catch (error) {
        return res.status(constants.status_code.header.server_error).send({ statusCode: 500, error:error.message, success: false });
    }
};

exports.getAllRole = async (req, res) => {
    try {
        const roles = await Role.find({IsDeleted:false}) 
        return res.status(constants.status_code.header.ok).send({
            statusCode: 200, data: roles, success: true });
    } catch (error) {
       return  res.status(constants.status_code.header.server_error).send({ statusCode: 500, error:error.message, success: false });
    }
}

 

exports.updateRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!role) {
            return res.status(404).json({ error: 'Role not found',success:false });
        }
       return  res.status(constants.status_code.header.ok).send({ statusCode: 200, message: constants.curd.update,success:true });
    } catch (error) {
       return  res.status(constants.status_code.header.server_error).send({ statusCode: 500, error,success:false });
    }
}
exports.deleteRole = async (req, res) => {
    try {
        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) {
            return res.status(404).json({ error: 'Role not found',success:false });
        }
        return res.status(constants.status_code.header.ok).send({ statusCode: 200, message: constants.curd.delete,success:true });
    } catch (error) {

       return  res.status(constants.status_code.header.server_error).send({ statusCode: 500, error:error.message,success:false });
    }
}







