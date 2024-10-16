const express = require("express")

const quotationController = require("../controllers/quotation.controller")
const authController = require("../controllers/auth.controller")
const router = express.Router();

router.route("/")
    .get(authController.protect,
        quotationController.getAllQuotation)
    .post(authController.protect,
        quotationController.createQuotation)


router.route('/:id')
    .delete(authController.protect, authController.restrictTo('admin'), quotationController.deleteQuotation);


router.route('/checkQuotation/:id')
    .get(authController.protect, authController.restrictTo('admin'), quotationController.checkQuotation);
router.route('/checkQuotation/:id')

router.route('/approveQuotation/:id')
    .get(authController.protect, authController.restrictTo('admin'), quotationController.approveQuotation);


module.exports = router;