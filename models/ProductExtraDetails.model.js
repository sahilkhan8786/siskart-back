const mongoose = require("mongoose");

const productExtraDetailsSchema = new mongoose.Schema({
    images: [String],
    ALIAS: {
        type: mongoose.Schema.Types.String,
        ref: "Product"
    },
    Description: String,
    links: String
})

const ProductExtraDetails = mongoose.model("ProductExtraDetails", productExtraDetailsSchema);

module.exports = ProductExtraDetails;