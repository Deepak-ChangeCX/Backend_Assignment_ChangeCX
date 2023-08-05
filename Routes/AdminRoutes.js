const express = require("express");
const router = express.Router();
const adminController = require("../Controllers/AdminController");
const authorize = require("../Middleware/AdminAuth");

router.get("/user/dashboard", authorize(["admin"]), adminController.getDashboardUsers);
router.get("/orders/dashboard", authorize(["admin"]), adminController.getDashboardOrders);
router.put("/products/update/:id", authorize(["admin"]), adminController.updateProduct);
router.post("/product/add", authorize(["admin"]), adminController.addProduct);
router.get("/user/products/dashboard", authorize(["admin"]), adminController.getDashboardProducts);
router.patch("/user/removeaccess/:userId", authorize(["admin"]), adminController.removeUserAccess);
router.patch("/user/ApproveAccess/:userId", authorize(["admin"]), adminController.approveUserAccess);
router.post("/products/add", authorize(["admin"]), adminController.addMultipleProducts);
router.delete("/products/:id", authorize(["admin"]), adminController.deleteProduct);

module.exports = router;
