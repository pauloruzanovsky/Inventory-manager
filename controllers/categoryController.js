const Category = require('../models/category'); 
const Item = require('../models/item')
const asyncHandler = require('express-async-handler')
const { body, validationResult } = require("express-validator");

exports.getCategories = asyncHandler(async (req, res) => {
    const allCategories = await Category.find({}).sort({category_name: 1}).exec();

    res.render("category_list", {
        title: "Category List",
        category_list: allCategories
    })
})

exports.categoryDetail = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id).exec();
    const allItems = await Item.find({category: req.params.id}).populate('supplier category').exec();


    res.render('category_detail', {
        title: 'Category Detail',
        category: category,
        item_list: allItems
    })
})

exports.createCategoryGet = asyncHandler(async (req, res) => {
    const category = { name: req.body.category, description: req.body.description } || new Category();
    res.render("category_form", { title: "Create Category", category: category, errors: [] })
})

exports.createCategoryPost = [
    body("name", "Category name is required")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "Description is required")
        .trim()
        .isLength({ min: 1 })
        .escape(),

    asyncHandler(async (req, res) => {
        const errors = validationResult(req);

        const category = new Category({name: req.body.name, description: req.body.description});

        if (!errors.isEmpty()) {
            res.render("category_form", {
                title: "Create Category",
                category: category,
                errors: errors.array()
            });
            return;
        } else {
            const categoryExists = await Category.findOne({name: req.body.name}).exec();
            if (categoryExists) {
                res.redirect(categoryExists._id)
            } else {
                await category.save().then(
                    res.redirect(category._id)
                );
            }
        }
    })
]


exports.deleteCategoryGet = asyncHandler(async (req, res) => {
    const [category, allItemsFromCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({category: req.params.id}).populate('supplier category').exec()
    ])

    if(!category) {
        res.redirect('/inventory/categories')
    }

    res.render('category_delete', {
        title: 'Delete Category',
        category: category,
        category_items: allItemsFromCategory
    })
})

exports.deleteCategoryPost = asyncHandler(async (req, res) => {
    const [category, allItemsFromCategory] = await Promise.all([
        Category.findById(req.params.id).exec(),
        Item.find({category: req.params.id}).populate('supplier category').exec()
    ])

    if(allItemsFromCategory.length > 0) {
        res.render('category_delete', {
            title: 'Delete Category',
            category: category,
            category_items: allItemsFromCategory
        })
        return;
    } else {
        await Category.findByIdAndRemove(req.body.categoryid);
        res.redirect('/inventory/categories')
    }
})

exports.updateCategoryGet = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id).exec()

    if(!category) {
        const err = new Error('Item not found');
        err.status = 404;
        return next(err);
    }

    res.render('category_form', {
        title: 'Update Category',
        category: category,
        errors: []
    })
})

exports.updateCategoryPost = [
    body("name", "Category name is required")
        .trim()
        .isLength({ min: 1 })
        .escape(),
    body("description", "Description is required")
        .trim()
        .isLength({ min: 1 })
        .escape(),


    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);

        const category = new Category({
            name: req.body.name,
            description: req.body.description,
            _id: req.params.id,
        })

        if (!errors.isEmpty()) {
    
            res.render('category_form', {
                title: 'Update Category',
                category: category,
                errors: errors.array()
            })
            return
        } else {
            await Category.findByIdAndUpdate(req.params.id, category, {})
            res.redirect("/inventory/category/" + req.params.id);
        }   


    })
]z