const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:           { type: String, required: true },
  email:          { type: String, required: true, unique: true, lowercase: true },
  password:       { type: String, required: true },
  role:           { type: String, default: "user" },
  approved:       { type: Boolean, default: false },
  specialization: { type: [String], default: [] },
  city:           { type: String, default: "" },
  country:        { type: String, default: "" },
  phone:          { type: String, default: "" },
  companyName:    { type: String, default: "" },
  customerType:   { type: String, default: "" },
  otp:       { type: String, default: null },
otpExpiry: { type: Date,   default: null },
level:     { type: Number, default: 0 },      // ← ADD THIS
zone:      { type: String, default: "all" },  // ← ADD THIS
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);