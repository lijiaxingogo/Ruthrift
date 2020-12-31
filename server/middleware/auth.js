const { User } = require('../models/User');

// get the token from req.cookies
// use the token to find user
// if user doesnt exist return {isAuth: false, error:true}
// else store token and user in the req
const auth = (req, res, next) => {
  const token = req.cookies.w_auth;
  User.findByToken(token, (err, user) => {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });
    req.token = token;
    req.user = user;
    next();
  });
};
module.exports = { auth };
