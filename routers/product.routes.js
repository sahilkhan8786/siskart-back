const express = require("express")
const productController = require('../controllers/product.controller')
const router = express.Router()

router.route("/")
    .get(productController.getAllProducts)
    .post(productController.createAllProducts)


// DATA SCAPPING
router.get('/scrapData', productController.getExtraProductDetails)

router.route("/:id")
    .get(productController.getSingleProduct)
    .patch(productController.updateProduct)


module.exports = router