#! /usr/bin/env node

console.log(
    'This script populates some test books, authors, genres and bookinstances to your database. Specified database as argument - e.g.: node populatedb "mongodb+srv://cooluser:coolpassword@cluster0.lz91hw2.mongodb.net/local_library?retryWrites=true&w=majority"'
  );
  
  // Get arguments passed on command line
  const userArgs = process.argv.slice(2);
  
  const Item = require("./models/item");
  const Category = require("./models/category");
  const Supplier = require("./models/supplier");
  
  const categories = [];
  const items = [];
  const suppliers = [];
  
  const mongoose = require("mongoose");
  mongoose.set("strictQuery", false); // Prepare for Mongoose 7
  
  const mongoDB = userArgs[0];
  
  main().catch((err) => console.log(err));
  
  async function main() {
    console.log('mongoDB: ', mongoDB)
    console.log("Debug: About to connect");
    await mongoose.connect(mongoDB);
    console.log("Debug: Should be connected?");
    await createCategories();
    await createSuppliers();
    await createItems();
    console.log("Debug: Closing mongoose");
    mongoose.connection.close();
  }
  
  async function categoryCreate(name, description) {
    categoryDetail = { name, description };
  
    const category = new Category(categoryDetail);
  
    await category.save();
    categories.push(category);
    console.log(`Added category: ${name}`);
  }
  

  async function supplierCreate(name, description) {
    supplierDetail = { name, description };
  
    const supplier = new Supplier(supplierDetail);
  
    await supplier.save();
    suppliers.push(supplier);
    console.log(`Added supplier: ${name}`);
  }

  async function itemCreate(name, category, supplier, quantity, price) {
    itemDetail = { name, category, supplier, quantity, price };
  
    const item = new Item(itemDetail);
  
    await item.save();
    items.push(item);
    console.log(`Added item: ${name}`);
  }

  
  async function createCategories() {
    console.log("Adding categories");
    await Promise.all([
      categoryCreate("Protein", "Proteins are the best"),
      categoryCreate("Vitamin", "Vitamins are cool"),
      categoryCreate("Aminoacid", "Aminoacids are essential"),
    ]);
  }
  
  async function createSuppliers() {
    console.log("Adding suppliers");
    await Promise.all([
      supplierCreate("Dux Nutrition", "Dux Nutrition is a premium brazilian brand."),
      supplierCreate("Growth Supplements", "Growth supplements is a cost-benefit brand"),
      supplierCreate("Optimum Nutrition", "Optimum Nutrition is a premium american brand"),
    ]);
  }

  async function createItems() {
    console.log("Adding Items");
    await Promise.all([
      itemCreate("Isolated Whey Protein", categories[0], suppliers[2], 841, 100),
      itemCreate("Concentrated Whey Protein", categories[0], suppliers[0], 1358, 80),
      itemCreate("Rice Protein", categories[0], suppliers[1], 573, 50),
      itemCreate("Pea Protein", categories[0], suppliers[1], 662, 50),
      itemCreate("Multivitamin", categories[1], suppliers[1], 573, 15),
      itemCreate("Vitamin D", categories[1], suppliers[2], 234, 20),
      itemCreate("Magnesium", categories[1], suppliers[0], 542, 17),
      itemCreate("Creatin", categories[2], suppliers[0], 2871, 95),
      itemCreate("Glutamin", categories[2], suppliers[1], 1846, 25),
      itemCreate("Leucin", categories[2], suppliers[2], 422, 20),      
    ]);
  }
  