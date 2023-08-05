const express = require("express");
const router = express.Router();
const cartController = require("../Controllers/CartController");


router.get("/user/cartItems", cartController.getCartItems);
router.patch("/users/cart", cartController.updateCart);
router.patch("/users/cart/update/:productId", cartController.updateCartItemQuantity);
router.delete("/users/cart/delete/:productId", cartController.removeCartItem);
router.patch("/users/cart/clear", cartController.clearCart);

module.exports = router;
