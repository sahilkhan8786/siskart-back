const express = require('express');
const productHeaderController = require('../controllers/productHeader.controller')
const router = express.Router();
router.route('/')
    .get(productHeaderController.getHeaderData)
    .post(productHeaderController.storeDataInHeader);


module.exports = router;