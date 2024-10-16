const mongoose = require('mongoose')



const productHeaderSchema = new mongoose.Schema({
    title: {
        type: String,
    },
    sequence: {
        type: Number
    },
    subHeader: [
        {
            subTitle: String,
            subTitleSequence: Number
        }
    ]
});




const ProductHeader = mongoose.model("ProductSchema", productHeaderSchema);
module.exports = ProductHeader