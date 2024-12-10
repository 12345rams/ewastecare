
var express = require('express');
var cart =require("../model/cartModel")
var router = express.Router();

router.post('/', async function(req, res, next) {
  const { token } = req.cookies;
  if (!token) {
      return res.status(401).send('You need to log in to add items to your cart');
  }

  try {
      const data = await cart.create({
          nameOfProduct: req.body.nameOfProduct,
          price: req.body.price,
          img: req.body.img,
          id: token,  
          discription: req.body.description,
      });
      res.send('Cart added successfully');
  } catch (error) {
      res.status(500).send('Something went wrong');
  }
});


module.exports = router;
