const mongoose = require("mongoose");
const app = require("./app");
const dotenv = require("dotenv");
dotenv.config();
const port = process.env.PORT || 5000;
const API = process.env.DATABASE_URL;

mongoose.set("strictQuery", false);

dotenv.config();

async function main() {
  await mongoose.connect(API);
  console.log("connected to database");
  app.listen(port, () => console.log(`Server is live at PORT => ${port}`));
}
main();
