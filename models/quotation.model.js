const mongoose = require("mongoose");



const quotationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    products: [
        {
            productsId: {
                type: mongoose.Schema.Types.ObjectId, // Use ObjectId to reference the Product schema
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    isReviewed: {
        type: Boolean,
        default: false,
    }



}, { timestamps: true });


const Quotation = mongoose.model("Quotation", quotationSchema);

module.exports = Quotation