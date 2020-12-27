const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");

app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/cartDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const productSchema = {
  name: String,
  price: String,
};

const cartSchema = {
  name: String,
  price: String,
};

const Product = mongoose.model("Product", productSchema);

const Cart = mongoose.model("Cart", cartSchema);

const port = process.env.PORT || 8000;

app.post("/addProduct", (req, res) => {
  const newProduct = new Product({
    name: req.body.name,
    price: req.body.price,
  });

  newProduct.save((err) => {
    if (err) {
      console.log("Error in creating product- ", err);
    } else {
      console.log("Product Created", newProduct);
    }
  });
});

app.get("/myCart", (req, res) => {
  Cart.find().then((data) => {
    console.log("Showing Cart Products--", data);
  });
});

app.post("/selectProduct/:productId", (req, res) => {
  Product.findOne({ _id: req.params.productId }, {}).then((data) => {
    const newCart = new Cart({
      name: data.name,
      price: data.price,
    });

    newCart.save((err) => {
      if (err) {
        console.log("Error in cart addition - ", err);
      } else {
        console.log("Cart product added", newCart);
      }
    });
  });

  // console.log(req.params.productId);
});

app.listen(port, () => {
  console.log(`app is running at ${port}`);
});
