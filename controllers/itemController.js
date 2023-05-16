const Item = require('../models/item') 
const Category = require('../models/category')
const Supplier = require('../models/supplier')
const asyncHandler = require('express-async-handler') 
const { body, validationResult } = require('express-validator')



exports.index = asyncHandler(async (req, res, next) => {
    const [
      numItems,
      numCategories,
      numSuppliers,
    ] = await Promise.all([
      Item.countDocuments({}).exec(),
      Category.countDocuments({}).exec(),
      Supplier.countDocuments({}).exec(),
    ]);
  
    res.render("index", {
      title: "Inventory Manager",
      item_count: numItems,
      category_count: numCategories,
      supplier_count: numSuppliers,
    });
  });

exports.getItems = asyncHandler(async (req, res) => {
    const allItems = await Item.find({}).sort({ name: 1 }).populate("category supplier").exec();;
    res.render("item_list", {
        title: "Item List",
        item_list: allItems
    })
})

exports.itemDetail = asyncHandler(async (req, res) => {
    const item = await Item.findById(req.params.id).populate("category supplier").exec();
    res.render("item_detail", {
        title: item.name,
        item: item
    })
})

exports.createItemGet = asyncHandler(async (req, res) => {
    const [allCategories, allSuppliers] = await Promise.all([
        Category.find({}).sort({category_name: 1}).exec(),
        Supplier.find({}).sort({supplier_name: 1}).exec()
    ])
    const item = { name: req.body.name, category: req.body.category, supplier: req.body.supplier } || new Item();

    
    res.render("item_form", {
        title: "Create Item",
        categories: allCategories,
        suppliers: allSuppliers,
        item: item,
        errors: []
    })
})

exports.createItemPost = [
    body("name", "Item name is required")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("category_id", "Category is required")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("supplier_id", "Supplier is required")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("quantity")
        .trim()
        .escape(),
    body("price")
        .trim()
        .escape(),


    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const item = new Item({
            name: req.body.name,
            category: req.body.category_id,
            supplier: req.body.supplier_id,
            quantity: req.body.quantity,
            price: req.body.price
        })

        if (!errors.isEmpty()) {
            
            const [allCategories, allSuppliers] = await Promise.all([
                Category.find({}).sort({category_name: 1}).exec(),
                Supplier.find({}).sort({supplier_name: 1}).exec()
            ])

            res.render("item_form", {
                title: "Create Item",
                categories: allCategories,
                suppliers: allSuppliers,
                item: item,
                errors: errors.array()

            })
        } else {
            await item.save().then(
                res.redirect(item._id)
            )
        }
    })
]


exports.deleteItemGet = asyncHandler(async (req, res) => {
    const item = await  Item.findById(req.params.id).populate('supplier category').exec();

    if(!item) {
        res.redirect('/inventory/items')
    }

    res.render('item_delete', {
        title: 'Delete Item',
        item: item,
    })

})

exports.deleteItemPost = asyncHandler(async (req, res) => {
    const item = await  Item.findById(req.params.id).populate('supplier category').exec();

        await Item.findByIdAndRemove(req.body.itemid);
        res.redirect('/inventory/items')
})

exports.updateItemGet = asyncHandler(async (req, res) => {
    const [item, allCategories, allSuppliers] = await Promise.all([
        Item.findById(req.params.id).populate('category supplier').exec(),
        Category.find({}).sort({category_name: 1}).exec(),
        Supplier.find({}).sort({supplier_name: 1}).exec()
    ])

    if(!item) {
        const err = new Error('Item not found');
        err.status = 404;
        return next(err);
    }

    res.render('item_form', {
        title: 'Update Item',
        item: item,
        categories: allCategories,
        suppliers: allSuppliers,
        errors: []
    })
})

exports.updateItemPost = [
    body("name", "Item name is required")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("category_id", "Category is required")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("supplier_id", "Supplier is required")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("quantity")
        .trim()
        .escape(),
    body("price")
        .trim()
        .escape(),


    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const item = new Item({
            name: req.body.name,
            category: req.body.category_id,
            supplier: req.body.supplier_id,
            quantity: req.body.quantity,
            price: req.body.price,
            _id: req.params.id,
        })

        if (!errors.isEmpty()) {
            const [allCategories, allSuppliers] = await Promise.all([
                Category.find({}).sort({category_name: 1}).exec(),
                Supplier.find({}).sort({supplier_name: 1}).exec()
            ])

            res.render('item_form', {
                title: 'Update Item',
                item: item,
                categories: allCategories,
                suppliers: allSuppliers,
                errors: errors.array()
            })
            return
        } else {
            await Item.findByIdAndUpdate(req.params.id, item, {})
            res.redirect("/inventory/item/" + req.params.id);
        }   


    })
]

