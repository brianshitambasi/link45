const mongoose = require('mongoose');

// -------------------- Category Schema --------------------
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String },
  order: { type: Number, default: 0 }
}, { timestamps: true });

// -------------------- Product Schema --------------------
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  discountedPrice: { type: Number },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  images: [{ type: String }],
  stock: { type: Number, default: 0 },
  isFeatured: { type: Boolean, default: false },
  tags: [String]
}, { timestamps: true });

// -------------------- FormSubmission Schema (Go Diamond Project) --------------------
const formSubmissionSchema = new mongoose.Schema({
  email: { type: String, required: true },
  mobile: { type: String, required: true },
  officialName: { type: String, required: true },
  gender: { type: String, enum: ['Male', 'Female', 'Other'] },
  age: { type: Number },
  address: { type: String },
  currentOccupation: { type: String },
  monthlyIncome: { type: String },
  openToOpportunities: { type: Boolean },
  wantBusiness: { type: Boolean },
  businessType: { type: String },
  uploadedFile: { type: String }
}, { timestamps: true });

// -------------------- Link Schema (for Linktree-style page) --------------------
const linkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  icon: { type: String },
  order: { type: Number, default: 0 },
  active: { type: Boolean, default: true }
}, { timestamps: true });

// ================= USER SCHEMA =================
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String, required: true },
  role: {
    type: String,
    enum: ["admin"],
    required: true,
  },
  active: { type: Boolean, default: true },
  profileImage: { type: String },
  lastLogin: { type: Date },
  loginCount: { type: Number, default: 0 }
}, { timestamps: true });


// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  const bcrypt = require('bcryptjs');
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function(enteredPassword) {
  const bcrypt = require('bcryptjs');
  return await bcrypt.compare(enteredPassword, this.password);
};

// -------------------- Order Schema --------------------
const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  orderItems: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalPrice: { type: Number, required: true },
  status: { type: String, default: 'Pending' },
  paymentMethod: { type: String },
  paymentResult: { type: Object }
}, { timestamps: true });

// -------------------- Export Models --------------------
module.exports = {
  Category: mongoose.model('Category', categorySchema),
  Product: mongoose.model('Product', productSchema),
  FormSubmission: mongoose.model('FormSubmission', formSubmissionSchema),
  Link: mongoose.model('Link', linkSchema),
  User: mongoose.model('User', userSchema),
  Order: mongoose.model('Order', orderSchema)
};