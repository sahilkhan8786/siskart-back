const { catchAsync } = require("../utils/catchAsync");
const jwt = require("jsonwebtoken")
const bcrypt = require('bcrypt');
const AppError = require("../utils/AppError");
const User = require("../models/user.model");

const JWT_SECRET = process.env.JWT_SECRET;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;


function sign_token(user, next) {
    try {
        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
        return token;
    } catch (error) {
        // Handle token creation errors
        return next(new AppError(403, "Failed to create token, try again"));
    }
}



exports.register = catchAsync(async (req, res, next) => {
    const { username, email, password, passwordConfirm } = req.body;

    // Check if all required fields are provided
    if (!username || !email || !password || !passwordConfirm) {
        return next(new AppError(400, "Please provide all required details"));
    }

    // Check if passwords match
    if (password !== passwordConfirm) {
        return next(new AppError(400, "Passwords do not match"));
    }

    // Check if user already exists
    const existingUserEmail = await User.findOne({ email });
    if (existingUserEmail) {
        if (existingUserEmail.email === email) {
            return next(new AppError(409, "Email is already in use"));
        }
    }
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
        if (existingUsername.username === username) {
            return next(new AppError(409, "Username is already in use"));
        }
    }


    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create the new user
    const user = await User.create({ username, email, password: hashedPassword });

    // Generate the token
    const token = sign_token(user, next)

    // Send response
    return res.status(201).json({
        status: 'success',
        data: {
            token
        }
    });
});

exports.login = catchAsync(async (req, res, next) => {

    const { email, password } = req.body;
    console.log(typeof (password))

    if (!email || !password) return next(new AppError(400, "Please provide all required details"));

    const foundUser = await User.findOne({ email }).select('+password');

    if (!foundUser || !await bcrypt.compare(password, foundUser.password)) return next(new AppError(403, "Wrong Credentials, Try Again!"))

    // Generate the token
    const token = sign_token(foundUser, next)

    // Send response
    return res.status(200).json({
        status: 'success',
        data: {
            token
        }
    });
});


exports.checkToken = catchAsync(async (req, res, next) => {
    let token;


    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(' ')[1]
    }

    if (!token) return next(new AppError(401, "You are not logged in, Please login to get access"))

    try {

        const decoded = jwt.verify(token, JWT_SECRET);
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) return next(new AppError(401, "The user belonging to this token no longer exist, Please login again"))
        req.user = currentUser
        return res.json({
            status: 'success',
            data: currentUser
        })
    } catch (error) {
        return next(new AppError(401, "Invalid Token, Please login again"))
    }
})


exports.protect = catchAsync(async (req, res, next) => {

    let token;


    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(' ')[1]
    }


    if (!token) return next(new AppError(401, "You are not logged in, Please login to get access"))

    try {

        const decoded = jwt.verify(token, JWT_SECRET);
        const currentUser = await User.findById(decoded.id);
        if (!currentUser) return next(new AppError(401, "The user belonging to this token no longer exist, Please login again"))
        req.user = currentUser
        next();
    } catch (error) {
        return next(new AppError(401, "Invalid Token, Please login again"))
    }

})

exports.restrictTo = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return next(new AppError(403, "You do not have permission to perform this action"))
        }
        next();
    }
}