const express = require("express");
const app = express();
const cors = require("cors");
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const Auth = require("./Middleware/Authorization");
const AccountRoute = require("./Routes/AccountRoute");
const ProductRoute = require("./Routes/ProductRoutes");
const OrderRoute = require("./Routes/OrderRoutes");
const AdminRoute = require("./Routes/AdminRoutes");
const CartRoute = require("./Routes/CartRoutes");
const PayPalRoute = require("./Routes/PayPalToken");

app.use("/api/v1", AccountRoute);
app.use("/api/v1", Auth, ProductRoute);
app.use("/api/v1", Auth, OrderRoute);
app.use("/api/v1", Auth, AdminRoute);
app.use("/api/v1", Auth, CartRoute);
app.use("/api/v1", Auth, PayPalRoute);

app.get("/", async (req, res) => {
  try {
    return res.status(200).json({ message: "Server is Ok" });
  } catch (e) {
    return res.status(400).json({ message: e.message });
  }
});

module.exports = app;
