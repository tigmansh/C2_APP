const express = require("express");
const { connection } = require("./configs/db");
const { UserRouter } = require("./routes/user.routes");
const { productRouter } = require("./routes/product.routes");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const app = express();
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Welcome");
});
app.use(cookieParser());
app.use("/user", UserRouter);
app.use("/product", productRouter);
app.listen(process.env.port, async () => {
  try {
    await connection;
    console.log("Connected to DB");
  } catch (err) {
    console.log(err.message);
  }
  console.log(`Server is running at port ${process.env.port}`);
});
