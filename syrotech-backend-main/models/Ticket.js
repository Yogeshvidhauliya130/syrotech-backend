const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  category:     { type: String, default: "" },
  subCategory:  { type: String, default: "" },
  serialNo:     { type: String, default: "" },
  mac:          { type: String, default: "" },
  model:        { type: String, default: "" }, 
  customer:     { type: String, default: "" },
  email:        { type: String, default: "" },
  phone:        { type: String, default: "" },
  description:  { type: String, default: "" },
  assignTo:     { type: String, default: "" },
 status: { type: String, default: "open" },
  raisedBy:     { type: String, default: "" },
  raisedByName: { type: String, default: "" },
  date:         { type: String, default: "" },
  acceptedAt:   { type: String, default: null },
  resolvedAt:   { type: String, default: null },
  createdAt:    { type: String, default: null },
  city:         { type: String, default: "" },
  state:        { type: String, default: "" },
  companyName:  { type: String, default: "" },
  country:      { type: String, default: "" },
  pincode:      { type: String, default: "" },

  // ✅ NEW: Source of ticket — "user" = customer raised, "support" = support person raised
  source:       { type: String, default: "user" },

  // ✅ NEW: How ticket was raised — call, email, whatsapp, walk-in
raisedVia:    { type: String, default: "call" },

  // Feedback fields
  feedbackRating:     { type: Number,  default: null },
  feedbackComment:    { type: String,  default: "" },
  feedbackResolved:   { type: String,  default: "" },
  feedbackReceivedAt: { type: String,  default: null },
  feedbackSent:       { type: Boolean, default: false },
  feedbackSentAt:     { type: String,  default: null },
  feedbackSentBy:     { type: String,  default: "" },

  // Reassign fields
  reassignedFrom:  { type: String, default: "" },
  reassignReason:  { type: String, default: "" },
  reassignedAt:    { type: String, default: null },
  reassignHistory: { type: Array,  default: [] },

  // Product Image (base64)
  productImage: { type: String, default: "" },

  // RMA fields
  rmaStatus:        { type: Boolean, default: false },
  rmaReason:        { type: String,  default: "" },
  rmaCenterName:    { type: String,  default: "" },
  rmaCenterCity:    { type: String,  default: "" },
  rmaCenterAddress: { type: String,  default: "" },
  rmaCenterPhone:   { type: String,  default: "" },
  rmaSentAt:        { type: String,  default: null },
  rmaSentBy:        { type: String,  default: "" },

  // Issue history for repeat customers
  issueHistory: { type: Array, default: [] },

  // Resolution fields
  resolutionNotes:     { type: String, default: "" },
  resolutionTimeTaken: { type: String, default: "" },
  resolvedBy:          { type: String, default: "" },
  hardwareVersion: { type: String, default: "" },
softwareVersion: { type: String, default: "" },
qvcCode:         { type: String, default: "" },
  ticketNumber:        { type: Number, default: null },
  customerType: { type: String, default: "" },
reopenedAt:   { type: String, default: null },
reopenCount:  { type: Number, default: 0 },

}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);

