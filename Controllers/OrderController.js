const OrderItem = require("../Modals/OrderSchema");
const Product = require("../Modals/ProductSchema");

const getOrders = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;

    const skipCount = (page - 1) * limit;
    const orders = await OrderItem.find({ user: req.user })
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(limit);

    return res.status(200).json({ message: "Success", orders: orders });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const createOrder = async (req, res) => {
  try {
    const orderItems = req.body.products;

    for (const item of orderItems) {
      const productId = item._id;
      const quantity = item.quantity;

      const product = await Product.findById(productId);

      if (!product) {
        return res
          .status(404)
          .json({ message: `Product with ID ${productId} not found.` });
      }

      if (quantity > product.InStock) {
        return res
          .status(400)
          .json({ message: `Not enough stock for product ${product.title}` });
      }

      product.InStock -= quantity;
      await product.save();
    }

    const newOrder = await OrderItem.create({ user: req.user, ...req.body });

    return res
      .status(201)
      .json({ message: "Order placed successfully", order: newOrder });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const { status } = req.body;

    const updatedOrder = await OrderItem.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    // const orders = await OrderItem.find().sort({ createdAt: -1 });

    return res.status(200).json({ message: `Status Updated to ${status}` });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

const getOrderById = async (req, res) => {
  try {
    const _id = req.params.orderId;

    const orders = await OrderItem.findById(_id);

    return res.status(200).json({ message: "Success", orders: orders });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getOrders,
  createOrder,
  updateOrderStatus,
  getOrderById,
};
