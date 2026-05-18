const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  category:    { type: String, required: true },
  subCategory: { type: String, required: true },
  items:       { type: [String], default: [] },
}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);