const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "You should provide a username"],
        unique: true,
        trim: true, // Trims whitespace from the username
        maxlength: [50, "Username must be less than 50 characters"]
    },
    email: {
        type: String,
        required: [true, "You should provide an email"],
        unique: true,
        lowercase: true, // Converts email to lowercase
        trim: true // Trims whitespace from the email
    },
    password: {
        type: String,
        required: [true, "You should provide a password"],
        minlength: [6, "Password must be at least 6 characters long"],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'moderator'],
        default: 'user' // Set a default role
    },
    isBlocked: {
        type: Boolean,
        default: false,
    }
}, {
    timestamps: true // Add createdAt and updatedAt fields
});

const User = mongoose.model("User", userSchema);

module.exports = User;
