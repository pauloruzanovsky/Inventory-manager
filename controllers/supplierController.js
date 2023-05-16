const Supplier = require('../models/supplier') 
const Item = require('../models/item')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");

exports.getSuppliers = asyncHandler(async (req, res) => {
    const allSuppliers = await Supplier.find({}).sort({name: 1}).exec();

    res.render('supplier_list', {
        title: 'Supplier List',
        supplier_list: allSuppliers
    })
})

exports.supplierDetail = asyncHandler(async (req, res) => {
    const supplier = await Supplier.findById(req.params.id).exec();
    const allItems = await Item.find({supplier: req.params.id}).exec();
    res.render('supplier_detail', {
        title: 'Supplier Detail',
        supplier: supplier,
        item_list: allItems
    })
    

})

exports.createSupplierGet = asyncHandler(async (req, res) => {
    const supplier = { name: req.body.supplier, description: req.body.description } || new Supplier();
    res.render("supplier_form", { title: "Create Supplier", supplier: supplier, errors: [] })
})

exports.createSupplierPost = [
    body("name", "Supplier name is required")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "Description is required")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        const supplier = new Supplier({name: req.body.name, description: req.body.description});

        if (!errors.isEmpty()) {
            res.render("supplier_form", {
                title: "Create Supplier",
                supplier: supplier,
                errors: errors.array()
            });
            return;
        } else {
            const supplierExists = await Supplier.findOne({name: req.body.name}).exec();
            if (supplierExists) {
                res.redirect(supplierExists._id)
            } else {
                await supplier.save().then(
                    res.redirect(supplier._id)
                )
            }
        }
    })
]

exports.deleteSupplierGet = asyncHandler(async (req, res) => {
    const [supplier, allItemsFromSupplier] = await Promise.all([
        Supplier.findById(req.params.id).exec(),
        Item.find({supplier: req.params.id}).populate('supplier category').exec()
    ])

    if(!supplier) {
        res.redirect('/inventory/suppliers')
    }

    res.render('supplier_delete', {
        title: 'Delete Supplier',
        supplier: supplier,
        supplier_items: allItemsFromSupplier
    })
})

exports.deleteSupplierPost = asyncHandler(async (req, res) => {
    const [supplier, allItemsFromSupplier] = await Promise.all([
        Supplier.findById(req.params.id).exec(),
        Item.find({supplier: req.params.id}).populate('supplier category').exec()
    ])

    if(allItemsFromSupplier.length > 0) {
        res.render('supplier_delete', {
            title: 'Delete Supplier',
            supplier: supplier,
            supplier_items: allItemsFromSupplier
        })
        return;
    } else {
        await Supplier.findByIdAndRemove(req.body.supplierid);
        res.redirect('/inventory/suppliers')
    }

})

exports.updateSupplierGet = asyncHandler(async (req, res) => {
    const supplier = await Supplier.findById(req.params.id).exec()

    if(!supplier) {
        const err = new Error('Item not found');
        err.status = 404;
        return next(err);
    }

    res.render('supplier_form', {
        title: 'Update Supplier',
        supplier: supplier,
        errors: []
    })
})

exports.updateSupplierPost = [
    body("name", "Supplier name is required")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "Description is required")
        .trim()
        .isLength({ min: 1 })
        .escape(),


    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const supplier = new Supplier({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id,
        })

        if (!errors.isEmpty()) {
    
            res.render('supplier_form', {
                title: 'Update Supplier',
                supplier: supplier,
                errors: errors.array()
            })
            return
        } else {
            await Supplier.findByIdAndUpdate(req.params.id, supplier, {})
            res.redirect("/inventory/supplier/" + req.params.id);
        }   


    })
]
