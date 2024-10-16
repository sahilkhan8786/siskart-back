const express = require('express')
const authController = require('../controllers/auth.controller');
const userController = require('../controllers/user.controller');
const router = express.Router();

router.get('/', authController.protect, authController.restrictTo('admin'), userController.getAllUser);

router.patch('/:id', authController.protect, authController.restrictTo('admin'), userController.blockUser);
router.delete('/:id', authController.protect, authController.restrictTo('admin'), userController.deleteUser);

module.exports = router;