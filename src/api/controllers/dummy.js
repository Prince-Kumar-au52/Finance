const asyncHandler = require("express-async-handler");

exports.dummyService = asyncHandler(async (req, res) => {
    res.json("Dummy api");
});
