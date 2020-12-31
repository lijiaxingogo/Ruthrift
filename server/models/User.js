/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
// store info about user: name email password last
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const moment = require('moment');

const SALT_WORK_FACTOR = 10;
const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: true,
    unique: 1,
  },
  password: {
    type: String,
    minlength: 5,
  },

  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  cart: {
    type: Array,
    default: [],
  },
  history: {
    type: Array,
    default: [],
  },
  image: String,
  token: {
    type: String,
  },
  tokenExp: {
    type: Number,
  },
});

// hash password before storing into database with bcrypt
// when a document is saved execuate
userSchema.pre('save', async function (next) {
  try {
    let user = this; // you cant use this is arrow function!!!!
    if (user.isModified('password')) {
      console.log('passsssword changed');
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
});
/**
 * 
async (next) => {
  let user = this;
  try {
    if (user.isModified('password')) {
      console.log('passsssword changed');
      const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
      const hash = await bcrypt.hash(user.password, salt);
      user.password = hash;
    } else {
      next();
    }
  } catch (error) {
    next(error);
  }
}
 */
/**
 * 
function (next) {
  var user = this;

  if (user.isModified('password')) {
    console.log('password changed');
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
}
 */

// compare passwords
userSchema.methods.comparePassword = function (userP, cb) {
  bcrypt.compare(userP, this.password, (err, isMatch) => {
    if (err) return cb(err);
    console.log('password is not match', err);
    cb(null, isMatch);
  });
};

// set jwt token:
userSchema.methods.generateToken = function (cb) {
  const user = this;
  const token = jwt.sign(user._id.toHexString(), 'secret');
  const oneHour = moment().add(1, 'hour').valueOf();

  user.tokenExp = oneHour;
  user.token = token;
  // TODO: will get back here later
  user.save((err, user) => {
    if (err) return cb(err);
    cb(null, user);
  });
};
// use jwt token to find the first valid document
userSchema.statics.findByToken = function (token, cb) {
  const user = this;
  jwt.verify(token, 'secret', (err, decode) => {
    user.findOne({ _id: decode, token }, (err, user) => {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model('User', userSchema);
module.exports = { User };
