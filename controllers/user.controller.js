const User = require("../models/user.model");
const AppError = require("../utils/AppError");
const { catchAsync } = require("../utils/catchAsync");

exports.getAllUser = catchAsync(async (req, res, next) => {
    const users = await User.find();

    return res.json({
        status: 'success',
        data: {
            users
        }
    })

});

exports.getSingleUser = catchAsync(async (req, res, next) => {

});

exports.blockUser = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const users = await User.findByIdAndUpdate(id, { ...req.body }
        , {
            new: true,
            runValidators: true
        });
    if (!users) return next(new AppError(404, "User doesn't Exist"));

    return res.json({
        status: 'success',

    })
});

exports.deleteUser = catchAsync(async (req, res, next) => {
    const id = req.params.id;
    const users = await User.findByIdAndDelete(id);
    if (!users) return next(new AppError(404, "User doesn't Exist"));

    return res.json({
        status: 'success',
        data: null

    })
});