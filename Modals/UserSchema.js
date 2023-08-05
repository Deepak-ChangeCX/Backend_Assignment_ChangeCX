const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema(
  {
    FirstName: { type: String, required: true },
    LastName: { type: String },
    EmailId: { type: String, required: true },
    Password: { type: String, required: true },
    PhoneNo: { type: Number, required: true },
    CartItems: { type: Array },
    IsDeleted: { type: Boolean, default: false },
    Role: { type: String, enum: ["admin", "normal"], default: "normal" },
    IsVerified: { type: Boolean, default: false },
    Otp: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("Users", UserSchema);

module.exports = User;
