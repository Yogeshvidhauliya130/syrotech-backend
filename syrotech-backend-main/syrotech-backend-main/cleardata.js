require("dotenv").config();
const mongoose = require("mongoose");
const Ticket   = require("./models/Ticket");
const User     = require("./models/User");

mongoose.connect(process.env.MONGO_URI).then(async () => {
  console.log("✅ Connected to MongoDB");

  await Ticket.deleteMany({});
  console.log("✅ All tickets deleted");

  await User.deleteMany({ role: "user" });
  console.log("✅ All user accounts deleted");

  const support = await User.find({ role: "support" });
  console.log(`✅ Kept ${support.length} support persons`);

  mongoose.connection.close();
  console.log("✅ Done! Database is fresh and ready.");
});