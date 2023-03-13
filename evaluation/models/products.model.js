const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: String,
    price: Number,
    qty: Number,
  },
  {
    versionKey: false,
  }
);

const Productmodel = mongoose.model("product", productSchema);

module.exports = { Productmodel };
