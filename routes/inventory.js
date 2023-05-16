const express = require('express');
const router = express.Router();
const itemController = require('../controllers/itemController')
const categoryController = require('../controllers/categoryController')
const supplierController = require('../controllers/supplierController')

// ITEM ROUTES
router.get('/', itemController.index);

router.get('/item/create', itemController.createItemGet);
router.post('/item/create', itemController.createItemPost);

router.get('/item/:id/delete', itemController.deleteItemGet);
router.post('/item/:id/delete', itemController.deleteItemPost);

router.get('/item/:id/update', itemController.updateItemGet);
router.post('/item/:id/update', itemController.updateItemPost);

router.get('/item/:id', itemController.itemDetail);
router.get('/items', itemController.getItems);

// CATEGORY ROUTES
router.get('/category/create', categoryController.createCategoryGet);
router.post('/category/create', categoryController.createCategoryPost);

router.get('/category/:id/delete', categoryController.deleteCategoryGet);
router.post('/category/:id/delete', categoryController.deleteCategoryPost);

router.get('/category/:id/update', categoryController.updateCategoryGet);
router.post('/category/:id/update', categoryController.updateCategoryPost);

router.get('/category/:id', categoryController.categoryDetail);
router.get('/categories', categoryController.getCategories);

// SUPPLIER ROUTES
router.get('/supplier/create', supplierController.createSupplierGet);
router.post('/supplier/create', supplierController.createSupplierPost);

router.get('/supplier/:id/delete', supplierController.deleteSupplierGet);
router.post('/supplier/:id/delete', supplierController.deleteSupplierPost);

router.get('/supplier/:id/update', supplierController.updateSupplierGet);
router.post('/supplier/:id/update', supplierController.updateSupplierPost);

router.get('/supplier/:id', supplierController.supplierDetail);
router.get('/suppliers', supplierController.getSuppliers);

module.exports = router;