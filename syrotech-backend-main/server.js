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

// ✅ ADD THESE 2 LINES




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
   ✅ UPDATED WITH REAL TEAM LIST
══════════════════════════════════ */
async function seedSupportPersons() {
    const list = [
    // ═══ OLT ═══
    { name: "Ankush Pal", email: "ankush.pal@syrotech.com", password: "ankush123", specialization: ["OLT"], level: 1, zone: "all", city: "", country: "India", phone: "" },
    { name: "Shailendra Singh", email: "shailendra.singh@syrotech.com", password: "shailendra123", specialization: ["OLT"], level: 1, zone: "all", city: "", country: "India", phone: "" },
    { name: "Yogesh Kumar", email: "yogesh.kumar@goip.in", password: "yogesh123", specialization: ["OLT"], level: 1, zone: "all", city: "", country: "India", phone: "" },
    { name: "Udit Pathak", email: "udit.pathak@syrotech.com", password: "udit123", specialization: ["OLT"], level: 1, zone: "all", city: "", country: "India", phone: "" },
    { name: "Arjun Kumar", email:"arjun.kumar@syrotech.com", password: "arjun123", specialization: ["OLT"], level: 1, zone: "all", city: "", country: "India", phone: "" },
    { name: "Harish Singh Bisht",email:"harish.bisht@syrotech.com", password: "harish123", specialization: ["OLT","ONT"], level: 2, zone: "all", city: "", country: "India", phone: "" },
    { name: "Gurupreet Singh", email: "gurupreet.singh@syrotech.com", password: "gurupreet123", specialization: ["OLT"], level: 2, zone: "all", city: "", country: "India", phone: "" },
    { name: "Nitesh Kumar Yadav", email: "nitesh.kumar@syrotech.com", password: "nitesh123", specialization: ["OLT","OLT"], level: 3, zone: "all", city: "", country: "India", phone: "" },
    

    // ═══ ONT ═══
    { name: "Harish Bind", email: "harish.bind@syrotech.com", password: "harish123", specialization: ["ONT"], level: 1, zone: "all except south", city: "", country: "India", phone: "" },
    { name: "Anuj Kumar", email: "anuj.kumar@syrotech.com", password: "anuj123", specialization: ["ONT"], level: 1, zone: "all except south", city: "", country: "India", phone: "" },
    { name: "Ayush Sharma", email: "ayush.sharma@syrotech.com", password: "ayush123", specialization: ["ONT"], level: 1, zone: "all except south", city: "", country: "India", phone: "" },
    { name: "Manish Kumar Singh", email: "manish.singh@syrotech.com", password: "manish123", specialization: ["ONT"], level: 1, zone: "all except south", city: "", country: "India", phone: "" },
    { name: "Kanhaiya Kumar", email: "kanhaiya.kumar@syrotech.com", password: "kanhaiya123", specialization: ["ONT", "Networking Switch", "Grandstream UC", "Grandstream Networking"], level: 1, zone: "all except south", city: "", country: "India", phone: "" },
    { name: "Amit Kumar das", email: "amit.das@syrotech.com", password: "amit123", specialization: ["ONT"], level: 1, zone: "all except south", city: "", country: "India", phone: "" },
    { name: "Debashish Halder", email: "debashish.halder@syrotech.com", password: "debashish123", specialization: ["ONT"], level: 1, zone: "all except south", city: "", country: "India", phone: "" },
    { name: "Biju Nayak", email: "biju.nayak@syrotech.com", password: "biju123", specialization: ["ONT"], level: 1, zone: "all except south", city: "", country: "India", phone: "" },
    { name: "Adarsh Kumar", email: "adarsh.k@syrotech.com", password: "adarsh123", specialization: ["ONT"], level: 1, zone: "South Region", city: "", country: "India", phone: "" },
    { name: "S.K.Seenivasan", email: "seenivasan.sk@goip.in", password: "seenivasan123", specialization: ["ONT","Networking Switch", "Grandstream UC", "Grandstream Networking"], level: 1, zone: "South Region", city: "", country: "India", phone: "" },
    { name: "Umesh Bari", email: "umesh.bari@syrotech.com", password: "umesh123", specialization: ["ONT"], level: 2, zone: "all except south", city: "", country: "India", phone: "" },
    { name: "Vivek Kumar", email: "vivek.kumar@syrotech.com", password: "vivek123", specialization: ["ONT"], level: 2, zone: "all except south", city: "", country: "India", phone: "" },
    { name: "Shekhar Rana", email: "shekhar.rana@syrotech.com", password: "shekhar123", specialization: ["ONT"], level: 2, zone: "all except south", city: "", country: "India", phone: "" },
    //{ name: "Harish Singh Bisht", email: "harish.bisht@syrotech.com", password: "harish123", specialization: ["ONT", "OLT"], level: 2, zone: "all ", city: "", country: "India", phone: "" },
     // { name: "Nitesh Kumar Yadav", email: "nitesh.kumar@syrotech.com", password: "nitesh123", specialization: ["OLT"], level: 3, zone: "all", city: "", country: "India", phone: "" },

    // ═══ SFP & MEDIA CONVERTER ═══
    { name: "RamTirth Bhargav", email: "ramtirth.bhargav@syrotech.com", password: "ramtirth123", specialization: ["Media Converter", "Optical Transceivers"], level: 1, zone: "all", city: "", country: "India", phone: "" },
{ name: "Hargovind Manya", email: "hargovind.manya@syrotech.com", password: "hargovind123", specialization: ["Media Converter", "Optical Transceivers"], level: 2, zone: "all", city: "", country: "India", phone: "" },
{ name: "Mohit Mittal", email: "mohit.mittal@goip.in", password: "mohit123", specialization: ["Media Converter", "Optical Transceivers"], level: 3, zone: "all", city: "", country: "India", phone: "" },
    // ═══ NETWORKING SWITCHES ═══
    //{ name: "Kanhaiya Kumar", email: "kanhaiya.kumar@syrotech.com", password: "kanhaiya123", specialization: ["ONT", "Networking Switches", "Grandstream"], level: 1, zone: "all except south", city: "", country: "India", phone: "" },
    { name: "Tushar Panchal", email: "tushar.panchal@goip.in", password: "tushar123", specialization: ["Networking Switch", "Grandstream UC", "Grandstream Networking"], level: 2, zone: "all", city: "", country: "India", phone: "" },
{ name: "Baidyanath Mishra", email: "baidyanath.mishra@goip.in", password: "baidyanath123", specialization: ["Networking Switch", "Grandstream UC", "Grandstream Networking"], level: 3, zone: "all", city: "", country: "India", phone: "" },
       // ═══ Grandstream UC & Grandstream Networking ═══
    // { name: "Kanhaiya Kumar", email: "kanhaiya.kumar@syrotech.com", password: "kanhaiya123", specialization: ["ONT", "Networking Switches", "Grandstream"], level: 1, zone: "all except south", city: "", country: "India", phone: "" },
   // { name: "Tushar Panchal", email: "tushar.panchal@goip.in", password: "tushar123", specialization: ["Networking Switches", "Grandstream"], level: 2, zone: "all", city: "", country: "India", phone: "" },
    //{ name: "Baidyanath Mishra", email: "baidyanath.mishra@goip.in", password: "baidyanath123", specialization: ["Networking Switches", "Grandstream"], level: 3, zone: "all", city: "", country: "India", phone: "" },


    // ═══ ENTRANCE PRODUCTS ═══
    { name: "Run Singh", email: "run.singh@goip.in", password: "run123", specialization: ["Entrance Product"], level: 1, zone: "all", city: "", country: "India", phone: "" },
{ name: "Gagandeep Sodhi", email: "gagandeep.sodhi@goip.in", password: "gagan123", specialization: ["Entrance Product"], level: 2, zone: "all", city: "", country: "India", phone: "" },
{ name: "Rabi Sharma", email: "rabi.sharma@goip.in", password: "rabi123", specialization: ["Entrance Product"], level: 3, zone: "all", city: "", country: "India", phone: "" },
    // ═══ PASSIVE PRODUCTS ═══
    { name: "Archana Verma", email: "archna.verma@goip.in", password: "archana123", specialization: ["Passive Products"], level: 1, zone: "all", city: "", country: "India", phone: "" },
{ name: "Kishan Kumar", email: "kishan.kumar@goip.in", password: "kishan123", specialization: ["Passive Products"], level: 2, zone: "all", city: "", country: "India", phone: "" },
{ name: "Akhil Sharma", email: "akhil.sharma@goip.in", password: "akhil123", specialization: ["Passive Products"], level: 3, zone: "all", city: "", country: "India", phone: "" },
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
    { $set: { 
        specialization: p.specialization, 
        city: p.city, 
        country: p.country, 
        phone: p.phone, 
        level: p.level, 
        zone: p.zone,
        approved: true,
        role: "support"
    }}
  );
  console.log("✅ Updated:", p.name, "level:", p.level, "zone:", p.zone);
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
   SIGNUP  ✅ UPDATED: supports customer role + phone + companyName
══════════════════════════════════ */
app.post("/api/signup", async (req, res) => {
  try {
   const { name, email, password, phone, companyName, customerType, role } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ error: "All fields required." });
    const exists = await User.findOne({ email: email.toLowerCase() });
    if (exists) return res.status(400).json({ error: "Email already registered." });
    const hashed    = await bcrypt.hash(password, 10);
    const finalRole = role === "customer" ? "customer" : role === "support" ? "support" : "user";
    await User.create({
      name,
      email:          email.toLowerCase(),
      password:       hashed,
      phone:          phone                  || "",
      companyName:    companyName            || "",
      customerType:   customerType           || "",
      role:           finalRole,
      approved:       false,
      city:           req.body.city          || "",
      country:        req.body.country       || "",
      specialization: req.body.specialization || [],
    });
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
   res.json({ token, user: { email: user.email, role: user.role, name: user.name, companyName: user.companyName || "", customerType: user.customerType || "", phone: user.phone || "" } });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ══════════════════════════════════
   GET ALL USERS
══════════════════════════════════ */

app.get("/api/users/me/:email", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase() }, "-password");
    if (!user) return res.status(404).json({ error: "User not found." });
    res.json(user);
  } catch (err) { res.status(500).json({ error: err.message }); }
});



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


app.post("/api/users/update-customer-type", async (req, res) => {
  try {
    const { email, customerType } = req.body;
    await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { $set: { customerType } }
    );
    res.json({ message: "Updated!" });
  } catch (err) { res.status(500).json({ error: err.message }); }
});
app.delete("/api/users/:email", async (req, res) => {
  try {
    await User.findOneAndDelete({ email: req.params.email });
    res.json({ message: "Removed." });
  } catch (err) { res.status(500).json({ error: err.message }); }
});

/* ══════════════════════════════════
   ✅ GET RMA CENTERS
══════════════════════════════════ */
app.get("/api/rma-centers", (req, res) => {
  res.json(RMA_CENTERS);
});
app.get("/api/products", (req, res) => {
  res.json({
    "OLT": {}, "ONT": {}, "Media Converter": {}, "Optical Transceivers": {},
    "Networking Switch": {}, "Entrance Product": {}, "Passive Products": {},
    "Grandstream UC": {}, "Grandstream Networking": {}
  });
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
    // ✅ Assign permanent global ticket number
    const last = await Ticket.findOne({ ticketNumber: { $exists: true } })
      .sort({ ticketNumber: -1 })
      .select("ticketNumber");
    const nextNumber = last ? last.ticketNumber + 1 : 1;
    const ticket = await Ticket.create({ ...req.body, ticketNumber: nextNumber });
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
   ✅ BACKUP ENDPOINT
══════════════════════════════════ */
app.get("/api/backup", async (req, res) => {
  const key = req.query.key;
  if (key !== "syrotech2025") {
    return res.status(401).json({ error: "Unauthorized" });
  }
  try {
    const tickets = await Ticket.find().lean();
    const users   = await User.find({}, "-password").lean();
    const backup  = {
      exportedAt:   new Date().toISOString(),
      totalTickets: tickets.length,
      totalUsers:   users.length,
      tickets,
      users,
    };
    res.setHeader("Content-Disposition", `attachment; filename=syrotech_backup_${new Date().toISOString().slice(0,10)}.json`);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(backup, null, 2));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


/* ══════════════════════════════════
   FORGOT PASSWORD — Send OTP
══════════════════════════════════ */
app.post("/api/forgot-password", async (req, res) => {
  try {
    const { email, role } = req.body;
    if (!email || !role)
      return res.status(400).json({ error: "Email and role are required." });

    if (role === "admin")
      return res.status(400).json({ error: "Admin cannot use forgot password." });

    const user = await User.findOne({ email: email.toLowerCase(), role });
    if (!user)
      return res.status(404).json({ error: "No account found with this email and role." });

    const otp       = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    await User.findByIdAndUpdate(user._id, { otp, otpExpiry });

    await transporter.sendMail({
     from: `"GO IP Global Services" <yogeshvidhauliya130@gmail.com>`,
      to:      user.email,
      subject: "Your OTP for Password Reset",
      html: `
        <div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
          <h2 style="color:#ff5a00;margin-bottom:8px;">Password Reset OTP</h2>
          <p style="color:#374151;">Hello <strong>${user.name}</strong>,</p>
          <p style="color:#374151;">Use the OTP below to reset your password. It expires in <strong>10 minutes</strong>.</p>
          <div style="text-align:center;margin:28px 0;">
            <span style="font-size:38px;font-weight:800;letter-spacing:10px;color:#111827;">${otp}</span>
          </div>
          <p style="color:#6b7280;font-size:13px;">If you did not request this, please ignore this email.</p>
          <hr style="border:none;border-top:1px solid #e5e7eb;margin:20px 0;"/>
          <p style="color:#9ca3af;font-size:12px;">GO IP Global Services</p>
        </div>
      `,
    });

    res.json({ message: "OTP sent to your email." });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: "Failed to send OTP. Try again." });
  }
});

/* ══════════════════════════════════
   VERIFY OTP
══════════════════════════════════ */
app.post("/api/verify-otp", async (req, res) => {
  try {
    const { email, otp, role } = req.body;
    const user = await User.findOne({ email: email.toLowerCase(), role });
    if (!user)
      return res.status(404).json({ error: "User not found." });
    if (!user.otp || !user.otpExpiry)
      return res.status(400).json({ error: "No OTP requested. Please request again." });
    if (new Date() > new Date(user.otpExpiry))
      return res.status(400).json({ error: "OTP expired. Please request a new one." });
    if (user.otp !== otp)
      return res.status(400).json({ error: "Wrong OTP. Please try again." });

    res.json({ message: "OTP verified." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ══════════════════════════════════
   RESET PASSWORD
══════════════════════════════════ */
app.post("/api/reset-password", async (req, res) => {
  try {
    const { email, otp, role, newPassword } = req.body;
    if (!newPassword || newPassword.length < 4)
      return res.status(400).json({ error: "Password must be at least 4 characters." });

    const user = await User.findOne({ email: email.toLowerCase(), role });
    if (!user)
      return res.status(404).json({ error: "User not found." });

    if (!user.otp || user.otp !== otp || new Date() > new Date(user.otpExpiry))
      return res.status(400).json({ error: "OTP expired or invalid. Please start again." });

    const hashed = await bcrypt.hash(newPassword, 10);
    await User.findByIdAndUpdate(user._id, {
      password:  hashed,
      otp:       null,
      otpExpiry: null,
    });

    res.json({ message: "Password reset successful! You can now login." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ══════════════════════════════════
   START SERVER
══════════════════════════════════ */

const sendOTPEmail = async (toEmail, toName, otp) => {
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer re_8rUs2uzS_KByKDKEGRQinznVxmxGQicGF",
    },
    body: JSON.stringify({
      from: "GO IP Global Services <onboarding@resend.dev>",
      to: [toEmail],
      subject: "Your OTP for Password Reset",
      html: `<div style="font-family:Arial,sans-serif;max-width:480px;margin:auto;padding:32px;border:1px solid #e5e7eb;border-radius:12px;">
        <h2 style="color:#ff5a00;">Password Reset OTP</h2>
        <p>Hello <strong>${toName}</strong>,</p>
        <p>Use the OTP below to reset your password. Expires in <strong>10 minutes</strong>.</p>
        <div style="text-align:center;margin:28px 0;">
          <span style="font-size:38px;font-weight:800;letter-spacing:10px;color:#111827;">${otp}</span>
        </div>
        <p style="color:#6b7280;font-size:13px;">If you did not request this, ignore this email.</p>
        <p style="color:#9ca3af;font-size:12px;">GO IP Global Services</p>
      </div>`,
    }),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(JSON.stringify(err));
  }
};
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});