const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  email:          { type: String, required: true, unique: true, lowercase: true },
  password:       { type: String, required: true },
  role:           { type: String, default: "user" },
  approved:       { type: Boolean, default: false },
  // ✅ NEW FIELDS for smart filtering
  specialization: { type: [String], default: [] }, // e.g. ["ONU", "Router"]
  city:           { type: String, default: "" },    // e.g. "Delhi"
  country:        { type: String, default: "" },    // e.g. "India"
  phone:          { type: String, default: "" },    // e.g. "9876543210"
  companyName: { type: String, default: "" },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);