const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');

const PORT = 8080;
dotenv.config();
const app = express();
app.get('/', (req, res) => {
  res.send('Hello World');
});
// set up parser: bodyparser for parsing request and cookie parser
app.use(bodyParser.urlencoded({ extend: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());
// set up routes
app.use('/api/user', require('./routes/users.js'));
app.use('/api/product', require('./routes/product.js'));
// serve uploads pic TODO: will come back here later
app.use('/uploads', express.static('uploads'));
// connect with database
// TODO: set up env variable for mongo_url
//
//const { MONGO_URI } = process.env;
const MONGO_URI =
  'mongodb+srv://Jiajiajiayou:lijiaxin123@cluster0.zhctm.mongodb.net/<dbname>?retryWrites=true&w=majority';
const URI = `${MONGO_URI}`;
mongoose
  .connect(URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Ruthrift',
  })
  .then(() => console.log('Connected to Mongo DB.'))
  .catch((err) => console.log(err));
// global error handling
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errorObj = { ...defaultErr, ...err };
  console.log(errorObj.log);
  return res.status(errorObj.status).json(errorObj.message);
});
app.listen(PORT, function () {
  console.log(`server listening on ${PORT}`);
});
