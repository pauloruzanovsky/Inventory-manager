const mongoose = require('mongoose')

const Schema = mongoose.Schema

const SupplierSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true}
})

SupplierSchema.virtual('url').get(function () {
    return `supplier/${this._id}`
})

module.exports = mongoose.model('Supplier', SupplierSchema);