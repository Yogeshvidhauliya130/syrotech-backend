require("dotenv").config();
const express  = require("express");
const cors     = require("cors");
const mongoose = require("mongoose");
const bcrypt   = require("bcryptjs");
const jwt      = require("jsonwebtoken");
const fs       = require("fs");
const path     = require("path");

const User   = require("./models/User");
const Ticket = require("./models/Ticket");

const app        = express();
const PORT       = process.env.PORT       || 3001;
const JWT_SECRET = process.env.JWT_SECRET || "syrotech_secret";

app.use(cors({
  origin: [
    "https://syrotech-frontend.vercel.app",
    "http://localhost:5173"
  ],
  credentials: true
}));
app.use(express.json({ limit: "10mb" })); // ✅ Increased limit for base64 images
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/* ══════════════════════════════════
   ✅ NEW: RMA CENTERS
   UPDATE THIS LIST WITH YOUR REAL DATA
══════════════════════════════════ */
const RMA_CENTERS = [
  {
    id:      1,
    name:    "Syrotech RMA Delhi",
    city:    "Delhi",
    country: "India",
    address: "Update with real address, Delhi",
    phone:   "9XXXXXXXXX",
  },
  {
    id:      2,
    name:    "Syrotech RMA Mumbai",
    city:    "Mumbai",
    country: "India",
    address: "Update with real address, Mumbai",
    phone:   "9XXXXXXXXX",
  },
  {
    id:      3,
    name:    "Syrotech RMA Kolkata",
    city:    "Kolkata",
    country: "India",
    address: "Update with real address, Kolkata",
    phone:   "9XXXXXXXXX",
  },
  {
    id:      4,
    name:    "Syrotech RMA Chennai",
    city:    "Chennai",
    country: "India",
    address: "Update with real address, Chennai",
    phone:   "9XXXXXXXXX",
  },
  // ✅ ADD MORE RMA CENTERS HERE:
  // {
  //   id:      5,
  //   name:    "Syrotech RMA Hyderabad",
  //   city:    "Hyderabad",
  //   country: "India",
  //   address: "Update with real address",
  //   phone:   "9XXXXXXXXX",
  // },
];

/* ══════════════════════════════════
   CONNECT TO MONGODB
══════════════════════════════════ */
mongoose.connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("✅ MongoDB Connected!");
    await seedSupportPersons();
    await migrateOldTickets();
  })
  .catch(err => {
    console.error("❌ MongoDB Failed:", err.message);
    process.exit(1);
  });

/* ══════════════════════════════════
   SEED SUPPORT PERSONS
   ✅ UPDATE THIS LIST WITH YOUR REAL DATA
══════════════════════════════════ */
async function seedSupportPersons() {
  const list = [
    {
      name:           "Rahul",
      email:          "rahul@support.com",
      password:       "rahul123",
      specialization: ["ONU"],
      city:           "Delhi",
      country:        "India",
      phone:          "9876543210",
    },
    {
      name:           "Amit",
      email:          "amit@support.com",
      password:       "amit123",
      specialization: ["Router"],
      city:           "Kolkata",
      country:        "India",
      phone:          "9876543211",
    },
    {
      name:           "Neha",
      email:          "neha@support.com",
      password:       "neha123",
      specialization: ["Switch", "Router"],
      city:           "Mumbai",
      country:        "India",
      phone:          "9876543212",
    },
    {
      name:           "Suresh",
      email:          "suresh@support.com",
      password:       "suresh123",
      specialization: ["ONU", "Switch"],
      city:           "Mumbai",
      country:        "India",
      phone:          "9876543213",
    },
  ];

  for (const p of list) {
    const exists = await User.findOne({ email: p.email });
    if (!exists) {
      const hashed = await bcrypt.hash(p.password, 10);
      await User.create({ ...p, password: hashed, role: "support", approved: true });
      console.log("✅ Added support person:", p.name);
    } else {
      await User.findOneAndUpdate(
        { email: p.email },
        { $set: { specialization: p.specialization, city: p.city, country: p.country, phone: p.phone } }
      );
    }
  }
}

/* ══════════════════════════════════
   MIGRATE OLD TICKETS
══════════════════════════════════ */
async function migrateOldTickets() {
  try {
    const file = path.join(__dirname, "tickets.json");
    if (!fs.existsSync(file)) return;
    const old = JSON.parse(fs.readFileSync(file, "utf-8"));
    if (!Array.isArray(old) || old.length === 0) return;
    const existing = await Ticket.countDocuments();
    if (existing > 0) { console.log("⏭️  Tickets already in MongoDB, skipping."); return; }
    for (const t of old) {
      await Ticket.create({
        category: t.category||"", serialNo: t.serialNo||"", mac: t.mac||"",
        customer: t.customer||"", email: t.email||"", phone: t.phone||"",
        price: t.price||"", description: t.description||"", assignTo: t.assignTo||"",
        status: t.status||"pending", raisedBy: t.raisedBy||"", raisedByName: t.raisedByName||"",
        date: t.date||"", acceptedAt: t.acceptedAt||null, resolvedAt: t.resolvedAt||null,
      });
    }
    console.log("✅ Migrated", old.length, "old tickets to MongoDB!");
  } catch (e) { console.log("Migration note:", e.message); }
}

/* ══════════════════════════════════
   SIGNUP
══════════════════════════════════ */
app.post("/api/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required." });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ error: "Email already registered." });
    const hashed = await bcrypt.hash(password, 10);
    await User.create({ name, email: email.toLowerCase(), password: hashed, role: "user", approved: false });
    res.json({ message: "Account created! Wait for admin approval." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ══════════════════════════════════
   LOGIN
══════════════════════════════════ */
app.post("/api/login", async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (role === "admin") {
      if (email === "Admin" && password === "Admin9876") {
        const token = jwt.sign({ email: "Admin", role: "admin", name: "Administrator" }, JWT_SECRET, { expiresIn: "12h" });
        return res.json({ token, user: { email: "Admin", role: "admin", name: "Administrator" } });
      }
      return res.status(401).json({ error: "Wrong admin credentials." });
    }
    const user = await User.findOne({ email: email.toLowerCase(), role });
    if (!user) return res.status(400).json({ error: "No account found." });
    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ error: "Wrong password." });
    if (!user.approved) return res.status(403).json({ error: "Account not approved yet." });
    const token = jwt.sign({ email: user.email, role: user.role, name: user.name }, JWT_SECRET, { expiresIn: "12h" });
    res.json({ token, user: { email: user.email, role: user.role, name: user.name } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ══════════════════════════════════
   GET ALL USERS
══════════════════════════════════ */
app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find({}, "-password");
    res.json(users);
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ══════════════════════════════════
   APPROVE USER
══════════════════════════════════ */
app.post("/api/users/approve", async (req, res) => {
  try {
    await User.findOneAndUpdate({ email: req.body.email.toLowerCase() }, { approved: true });
    res.json({ message: "Approved." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ══════════════════════════════════
   DELETE USER
══════════════════════════════════ */
app.delete("/api/users/:email", async (req, res) => {
  try {
    await User.findOneAndDelete({ email: req.params.email });
    res.json({ message: "Removed." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ══════════════════════════════════
   ✅ NEW: GET RMA CENTERS
══════════════════════════════════ */
app.get("/api/rma-centers", (req, res) => {
  res.json(RMA_CENTERS);
});

/* ══════════════════════════════════
   GET ALL TICKETS
══════════════════════════════════ */
app.get("/tickets", async (req, res) => {
  try {
    const tickets = await Ticket.find().sort({ createdAt: -1 });
    res.json(tickets.map(t => ({ ...t.toObject(), id: t._id.toString() })));
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ══════════════════════════════════
   CREATE TICKET
══════════════════════════════════ */
app.post("/tickets", async (req, res) => {
  try {
    const ticket = await Ticket.create(req.body);
    res.status(201).json({ ...ticket.toObject(), id: ticket._id.toString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ══════════════════════════════════
   UPDATE TICKET
══════════════════════════════════ */
app.patch("/tickets/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id, { $set: req.body }, { new: true }
    );
    if (!ticket) return res.status(404).json({ error: "Not found." });
    res.json({ ...ticket.toObject(), id: ticket._id.toString() });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ══════════════════════════════════
   DELETE TICKET
══════════════════════════════════ */
app.delete("/tickets/:id", async (req, res) => {
  try {
    await Ticket.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ══════════════════════════════════
   START SERVER
══════════════════════════════════ */
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});