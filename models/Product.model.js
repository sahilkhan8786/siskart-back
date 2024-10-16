const mongoose = require('mongoose')


const productSchema = new mongoose.Schema({
    ALIAS: {
        type: String,
    },
    ItemGroup: {
        type: String
    },
    ItemSubGroup: {
        type: String
    },
    Brand: {
        type: String
    },
    Filter2: {
        type: String
    },
    Filter3: {
        type: String
    },
    Filter4: {
        type: String
    },
    Filter5: {
        type: String
    },
    Filter6: {
        type: String
    },
    Filter7: {
        type: String
    },
    Filter8: {
        type: String
    },
    Filter9: {
        type: String
    },
    Filter10: {
        type: String
    },
    Description1: {
        type: String
    },
    Description2: {
        type: String
    },
    Description3: {
        type: String
    },
    Description4: {
        type: String
    },
    ItemDetails: {
        type: String
    },
    Unit: {
        type: String
    },
    Alternate_Unit: {
        type: String
    },
    slug: {
        type: String
    },
    HSN: {
        type: Number
    },
    GST: {
        type: Number
    },
    RetailPrice: {
        type: Number
    },
    MRP: {
        type: Number
    },
    CON_FACTOR: {
        type: Number
    },
    Price: {
        type: Number
    },
    Sale_price: {
        type: Number
    },
    Amount: {
        type: Number
    },
    QTY: {
        type: Number
    },
})


const Product = mongoose.model("Product", productSchema);

module.exports = Product