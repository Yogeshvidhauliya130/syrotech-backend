const mongoose = require("mongoose");

const priorityCompanySchema = new mongoose.Schema({
  companyName: { type: String, required: true, unique: true },
  setBy:       { type: String, default: "Admin" },
  setAt:       { type: Date,   default: Date.now },
}, { timestamps: true });

module.exports = mongoose.model("PriorityCompany", priorityCompanySchema);