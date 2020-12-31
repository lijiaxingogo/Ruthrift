/* eslint-disable no-underscore-dangle */
/* eslint-disable curly */
/* eslint-disable nonblock-statement-body-position */
const express = require('express');
const { User } = require('../models/User');
const { Product } = require('../models/Product');
const { Payment } = require('../models/Payment');
const router = express.Router();
const { auth } = require('../middleware/auth');

// functionality includes: /auth /register /login /loginout
// addtocart /deletefromcart /usercartinfo
// pay successbuy / history

//
router.get('/auth', auth, (req, res) => {
  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role !== 0,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
    cart: req.user.cart,
    history: req.user.history,
  });
});
// save the user info into databse
router.post('/register', async (req, res) => {
  const user = new User(req.body);
  try {
    await user.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    return {
      log: `Register: fail to save user info into database. Error: ${error}`,
      message: {
        err: 'Error occured in register. Check server log for more information',
      },
    };
  }
});
// find the user through the email, if not find return {loginSuccuess: fail, msg:''}
// if the user is found, compare password(bcrypt with the real one)
// if bcrypt.compare true, cookie are store in the response(exp)+{user_id,success status}
// TODO: instead using callback modify it to a async way
router.post('/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccuess: false,
        message: 'Auth failed, email not found',
      });
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccuess: false, message: 'Wrong password' });
      user.generateToken((err, user) => {
        if (err) return res.status.send(err);
        res.cookie('w_authExp', user.tokenExp);
        res
          .cookie('w_auth', user.token)
          .status(200)
          .json({ loginSuccuess: true, userId: user._id });
      });
    });
  });
});
// use the cookies to get the token and use the token to find document
// once log out clear the token in the database
router.get('/logout', auth, (req, res) => {
  console.log(req);
  User.findOneAndUpdate(
    { _id: req.user._id },

    { token: '', tokenExp: '' },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({ success: true });
    }
  );
});

// addToCart
// from auth we have the user info stored in the req
// find the cart info from the user and check if the req.query.productId exist
// if doesnt exist, duplicate=false we push an obj with id(product id), quantity and date
// if exist, we set duplicate=true, update the quantity of the product by increasing one
// TODO: replace the callback hall with async and await
router.get('/addToCart', auth, (req, res) => {
  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    let duplicate = false;
    console.log('addToCart: the doc of the user', userInfo);
    userInfo.cart.forEach((a) => {
      if (a.id === req.query.productId) duplicate = true;
    });
    if (!duplicate) {
      User.findOneAndUpdate(
        { _id: req.user_id },
        {
          $push: {
            cart: { id: req.query.productId, quantity: 1, date: Date.now() },
          },
        },
        { new: true },
        (err, userInfo) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json(userInfo.cart);
        }
      );
    } else {
      User.findOneAndUpdate(
        { _id: req.user._id, 'cart.id': req.query.productId },
        { $inc: { 'cart.$.quantity': 1 } },
        { new: true },
        (err, userInfo) => {
          if (err) return res.json({ success: false, err });
          res.status(200).json(userInfo.cart);
        }
      );
    }
  });
});
// removefromcart:
// use the user id to delete the obj from req(req.query_id)
// get the new updated cart(user) and update cart info(products)
router.get('/removeFromCart', auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $pull: { cart: { id: req.query._id } } }, //delete the {}from cart array
    { new: true },
    (err, userInfo) => {
      let cart = userInfo.cart;
      let products = cart.map((a) => a.id);
      Product.find({ _id: { $in: products } })
        .populate('writer')
        .exec((err, cartDetail) => {
          if (err) return res.json({ success: false, err });
          return res.status(200).json({ cartDetail, cart });
        });
    }
  );
});
// userCartInfo: find the user and provide cart details and cart id array
router.get('/userCartInfo', auth, (req, res) => {
  const id = req.user._id;
  User.find({ _id: id }, (err, user) => {
    const cart = user.cart;
    const products = cart.map((a) => a.id);
    Product.find({ _id: { $in: products } })
      .populate('writer')
      .exec((err, cartDetail) => {
        if (err) return res.status(400).send(err);
        console.log('what the fuck is cartDetail', cartDetail);
        return res.status(200).json({ success: true, cartDetail, cart });
      });
  });
});
// successBuy: frontend will update user cart detail and cartDetail

router.post('/successBuy', auth, (req, res) => {
  // push product
  //
  // let history = []
  // let transactionData = {}
  // req.body.cartDetail.forEach((item)=>{
  // })
});
module.exports = router;
