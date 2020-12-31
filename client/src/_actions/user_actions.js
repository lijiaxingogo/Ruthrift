import axios from 'axios';

import {
  LOGIN_USER,
  REGISTER_USER,
  AUTH_USER,
  LOGOUT_USER,
  ADD_TO_CART_USER,
  GET_CART_ITEMS_USER,
  REMOVE_CART_ITEM_USER,
  ON_SUCCESS_BUY_USER,
} from './types';

// action: registeruser make a post request to the user register server and with user data
export function registerUser(dataToSubmit) {
  // grab the data from response and store it in the request
  const request = axios
    .post('/api/users/register', dataToSubmit)
    .then((response) => response.data);
  return {
    type: REGISTER_USER,
    payload: request,
  };
}

// action: userlogin
export function loginUser(dataToSubmit) {
  const request = axios
    .post('/api/users/login', dataToSubmit)
    .then((response) => response.data);
  return {
    type: LOGIN_USER,
    payload: request,
  };
}

// action: auth
export function auth() {
  const request = axios
    .get('http://localhost:8080/api/user/auth')
    .then((response) => response.data);
  return {
    type: AUTH_USER,
    payload: request,
  };
}
// logout
export function logoutUser() {
  const request = axios
    .get('/api/user/logout')
    .then((response) => response.data);
  return {
    type: LOGOUT_USER,
    payload: request,
  };
}
// addToCart:
// hit the backend: use the cookies(auth) to find the user and use the req.query to get the product
// update cart in the database and return it back
export function addToCart(_id) {
  const request = axios
    .get(`/api/user/addToCart?productId=${_id}`)
    .then((response) => response.data);
  return {
    type: ADD_TO_CART_USER,
    payload: request,
  };
}
// TODO:
export function getCartItems() {}
// user.jsremove from cart: response.data stores cart(id, quantity and date) and cartDetial info(all product info)
// assign a new property quantity to cartDetail
export function removeCartItem(id) {
  const request = axios
    .get(`/api/user/removeFromCart?_id=${id}`)
    .then((res) => {
      res.data.cart.forEach((a, i) => {
        res.data.cartDetail.forEach((b, j) => {
          if (a.id === b._id) {
            res.data.cartDetail[j].quantity = a.quantity;
          }
        });
      });
      return res.data;
    });
  return {
    type: REMOVE_CART_ITEM_USER,
    payload: request,
  };
}
