const express = require("express");
const { Productmodel } = require("../models/products.model");

const { authenticate } = require("../middleware/authenticate");

const { authorise } = require("../middleware/authorise");

require("dotenv").config();

const productRouter = express.Router();

productRouter.post(
  "/addproducts",
  authenticate,
  authorise(["seller"]),
  async (req, res) => {
    const { name, price, qty } = req.body;
    const product = new Productmodel({ name, price, qty });
    await product.save();

    res.send({ msg: `${req.body.name} is added to products.` });
  }
);

productRouter.delete(
  "/deleteproducts",
  authenticate,
  authorise(["seller"]),
  async (req, res) => {
    const { name } = req.body;
    const targetProduct = await Productmodel.findOneAndDelete({
      name: req.body.name,
    });
    if (targetProduct) {
      res.send({ msg: `${req.body.name} is deleted from products list` });
    } else {
      res.send({ Error: `${req.body.name} is not found in products list !` });
    }
  }
);


productRouter.get("/products", authenticate, async(req,res)=>{
    const allProducts = await Productmodel.find();
    res.send(allProducts);
});

module.exports = { productRouter };