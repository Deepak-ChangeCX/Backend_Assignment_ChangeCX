const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  title: { type: String, required: true },
  brand: { type: String, required: true },
  images: { type: Array, required: true },
  InStock: { type: Number, required: true },
  bestSeller: { type: Boolean, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  IsDiscount: { type: Boolean, required: true },
  quantity: { type: Number, required: true },
  discountPercent: { type: Number },
  description: { type: String, required: true },
});

const OrderSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Types.ObjectId, ref: "users" },
    products: [productSchema],
    totalPrice: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Placed", "Cancelled", "Return", "Delivered"],
      default: "Placed",
    },
    shippingAddress: { type: Object, required: true },
    paymentId: { type: String, required: true },
  },
  { timestamps: true }
);

const OrderItem = mongoose.model("OrderItems", OrderSchema);

module.exports = OrderItem;
