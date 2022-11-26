const express = require('express');
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.status(200).send("Welcome to Coderschool !");
});

// CAR
const carAPI = require('./car.api');
router.use('/cars', carAPI);

module.exports = router;
