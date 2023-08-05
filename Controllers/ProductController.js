const Product = require("../Modals/ProductSchema");

const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 8;

    const skipCount = (page - 1) * limit;

    const products = await Product.find().skip(skipCount).limit(limit);

    return res.status(200).json({ products: products });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const _id = req.params.id;

    const product = await Product.findById(_id);

    return res.status(200).json({
      message: "Success",
      product: product,
    });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

const getProductsByIds = async (req, res) => {
  const ids = req.params.ids.split(",");
  try {
    const products = await Product.find({ _id: { $in: ids } });
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
};

const getProductsByCategory = async (req, res) => {
  try {
    const category = req.params.category;
    const page = parseInt(req.query.page) || 1;
    const limit = 8;

    const skipCount = (page - 1) * limit;

    const products = await Product.find({ category })
      .skip(skipCount)
      .limit(limit);

    return res.status(200).json({
      message: "Success",
      products: products,
    });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

const updateProductById = async (req, res) => {
  try {
    const productId = req.params.id;
    const updatedData = req.body;

    const product = await Product.findByIdAndUpdate(productId, updatedData, {
      new: true,
    });

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res.status(200).json({
      message: "Product updated successfully",
      product: product,
    });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getProductsByIds,
  getProductsByCategory,
  updateProductById,
};
