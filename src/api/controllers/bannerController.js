const constants = require("../../helper/constants");
const Banner = require("../../models/banner");

const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Ensure you have set up your Cloudinary configuration
cloudinary.config({
  cloud_name: "dhzk0ztrn",
  api_key: "571339484391153",
  api_secret: "WWmOJpVF5y02r7Blu2oAr0RxbU0",
});

exports.addBanner = async (req, res) => {
  try {
    const file = req.files.banner;

    const result = await cloudinary.uploader.upload(file.tempFilePath);

    const banner = await Banner.create({
    Banner: result.secure_url, 
     
    });

    return res
      .status(constants.status_code.header.ok)
      .send({ message: constants.curd.add, success: true });
  } catch (error) {
    return res
      .status(constants.status_code.header.server_error)
      .send({ error: error.message, success: false });
  }
};


exports.getAllBanner= async (req, res) => {
  try {
   

    const records = await Banner.find({IsDeleted: false});
    return res.status(constants.status_code.header.ok).send({
      statusCode: 200,
      data: records,
      success: true,
     
    });
  } catch (error) {
    res
      .status(constants.status_code.header.server_error)
      .send({ statusCode: 500, error: error.message, success: false });
  }
};

exports.getBannerById = async (req, res) => {
  try {
    const banner = await Banner.findById(req.params.id);
    if (!banner) {
      return res
        .status(404)
        .json({ error: "Banner not found", success: false });
    }
    return res
      .status(constants.status_code.header.ok)
      .send({ statusCode: 200, data: banner, success: true });
  } catch (error) {
    return res
      .status(constants.status_code.header.server_error)
      .send({ statusCode: 500, error: error.message, success: false });
  }
};

exports.updateBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!banner) {
      return res
        .status(404)
        .json({ error: "Banner not found", success: false });
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

exports.deleteBanner = async (req, res) => {
  try {
    const banner = await Banner.findByIdAndUpdate(req.params.id, {
      IsDeleted: true,
    });
    if (!banner) {
      return res
        .status(404)
        .json({ error: "Banner not found", success: false });
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

 
