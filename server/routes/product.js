const express = require('express');
const router = express.Router();
const multer = require('multer');
const { Product } = require('../models/Product');
const { auth } = require('../middleware/auth');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}_${file.originalname}`);
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== '.jpg' || ext !== '.png') {
      return cb(res.status(400).end('only jpg, png are allowed'), false);
    }
    cb(null, true);
  },
});
const upload = multer({ storage: storage }).single('file');

router.post('/uploadImage', auth, (req, res) => {
  upload(req, res, (err) => {
    if (err) return res.json({ success: false, err });
    // TODO: res.req.file.path why
    return res.json({
      success: true,
      image: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});
// save the product info into database. The data is stored at req.body
router.post('/uploadProduct', auth, (req, res) => {
  const product = new Product(req.body);
  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

// what does the parseInt mean
router.post('/getProducts', (req, res) => {
  // let order = req.body.order ? req.body.order : 'desc';
  // let sortBy = req.body.soryBy ? req.body.sortBy : '_id';
  // let limit = req.body.limit ? parseInt(req.body.limit) : 100;
  // let skip = parseInt(req.body.skip);
  // let findArgs = {};
  // let term = req.body.searchTerm;
  // for (let key in req.body.filters) {
  //   if (key === 'price') {
  //     findArgs[key] = {
  //       $gte: req.body.filters[key][0],
  //       $lte: req.body.filters[key][1],
  //     };
  //   } else {
  //     findArgs[key] = req.body.filters[key];
  //   }
  // }
  // console.log('what;s findArgs', findArgs);
});
module.exports = router;
