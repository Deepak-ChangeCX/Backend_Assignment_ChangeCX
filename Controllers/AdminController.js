const User = require("../Modals/UserSchema");
const Product = require("../Modals/ProductSchema");
const OrderItem = require("../Modals/OrderSchema");

const authorize = require("../Middleware/AdminAuth");
const express = require("express");
const router = express.Router();

const getDashboardUsers = async (req, res) => {
  try {
        const page = parseInt(req.query.page) || 1;
        const limit = 6;
    
        const skipCount = (page - 1) * limit;
        const users = await User.find({ _id: { $ne: req.user } })
          .sort({ createdAt: -1 })
          .skip(skipCount)
          .limit(limit);
    
        return res.status(200).json({ users: users });
      } catch (e) {
        return res.status(400).json({ message: e.message });
      }
};

const getDashboardOrders = async (req, res) => {
   try {
    const page = parseInt(req.query.page) || 1;
    const limit = 6;

    const skipCount = (page - 1) * limit;
    const orders = await OrderItem.find()
      .sort({ createdAt: -1 })
      .skip(skipCount)
      .limit(limit);

    return res.status(200).json({ orders: orders });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updateData = req.body;
    // console.log(updateData)

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Update the product fields based on the updateData object
    product.title = updateData.title || product.title;
    product.brand = updateData.brand || product.brand;
    product.images = updateData.images || product.images;
    product.InStock = updateData.InStock || product.InStock;
    product.bestSeller =
      updateData.bestSeller !== undefined
        ? updateData.bestSeller
        : product.bestSeller;
    product.category = updateData.category || product.category;
    product.price = updateData.price || product.price;
    product.IsDiscount =
      updateData.IsDiscount !== undefined
        ? updateData.IsDiscount
        : product.IsDiscount;
    product.discountPercent =
      updateData.discountPercent || product.discountPercent;
    product.description = updateData.description || product.description;

    await product.save();

    return res
      .status(200)
      .json({ message: "Product updated successfully", product: product });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

const addProduct = async (req, res) => {
  try {
    const updateData = req.body.formData;

    // Update the product fields based on the updateData object
    const product = new Product({
      title: updateData.title,
      brand: updateData.brand,
      images: updateData.images.split(","),
      InStock: updateData.InStock,
      bestSeller: updateData.bestSeller,
      category: updateData.category,
      price: updateData.price,
      IsDiscount: updateData.IsDiscount,
      discountPercent: updateData.discountPercent,
      description: updateData.description,
    });

    await product.save();

    return res
      .status(201)
      .json({ message: "Product updated successfully", product: product });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

const getDashboardProducts = async (req, res) => {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = 6;

      const skipCount = (page - 1) * limit;
      const products = await Product.find()
        .sort({ createdAt: -1 })
        .skip(skipCount)
        .limit(limit);

      return res.status(200).json({ products: products });
    } catch (e) {
      return res.status(400).json({ message: e.message });
    }
  
};

const removeUserAccess = async (req, res) => {
    try {
      const userId = req.params.userId;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.IsDeleted = true;

      await user.save();

      return res
        .status(200)
        .json({ message: "User Access Removed", user: user });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
};

const approveUserAccess = async (req, res) => {
    try {
      const userId = req.params.userId;

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      user.IsDeleted = false;

      await user.save();

      return res
        .status(200)
        .json({ message: "User Access Removed", user: user });
    } catch (error) {
      return res.status(400).json({ message: error.message });
    }
};

const addMultipleProducts = async (req, res) => {
   try {
    const products = req.body;

    const AddData = await Product.insertMany(req.body);

    return res.status(201).json({
      message: "Product Added Successfully",
      product: AddData,
    });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

module.exports = {
  getDashboardUsers,
  getDashboardOrders,
  updateProduct,
  addProduct,
  getDashboardProducts,
  removeUserAccess,
  approveUserAccess,
  addMultipleProducts,
  deleteProduct,
};
