const mongoose = require("mongoose");
const Car = require("../models/Car");
const { sendResponse, AppError } = require("../helpers/utils.js");

const carController = {};

// CREATE CARS

carController.createCar = async (req, res, next) => {
  // YOUR CODE HERE
  const { make, model, transmission_type, size, style, release_date, price } =
    req.body;
  const info = {
    make,
    model,
    transmission_type,
    size,
    style,
    release_date,
    price,
  };
  if (!info) throw new AppError(402, "Bad Request", "Create Car Error");
  // const carObj = new Car(info);
  // await carObj.save(function (err) {
  try {
    const carObj = await Car.create(info);
    sendResponse(res, 200, true, { data: carObj }, null, "Create Car Success");
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

// GET ALL CARS

carController.getCars = async (req, res, next) => {
  try {
    // YOUR CODE HERE

    let { page, limit } = req.query;
    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    let offset = limit * (page - 1);

    let listOfCar = await Car.find();

    listOfCar = listOfCar.reverse().slice(offset, offset + limit);
    let totalCars = await Car.find({ isDeleted: false }).countDocuments();
    let total = Math.ceil(totalCars / limit);

    let data = { cars: listOfCar, page: page, total: total };

    sendResponse(res, 200, true, data, null, "Get All Cars Success");
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

//  EDIT CARS

carController.editCar = async (req, res, next) => {
  const { make, model, transmission_type, size, style, release_date, price } =
    req.body;
  const info = {
    make,
    model,
    transmission_type,
    size,
    style,
    release_date,
    price,
  };
  const { id } = req.params;
 
  const options = { new: true };

  if (!Object.keys(info)) throw new Error("field is invalid");

  try {
    const updated = await Car.findByIdAndUpdate(id, info, options);

    if (!updated) throw new AppError(400, "Car is not exist");

    sendResponse(res, 200, true, { Car: updated }, null, "Update Car Success");
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

//  DELETE CARS

carController.deleteCar = async (req, res, next) => {
 try {
    // YOUR CODE HERE
    const { id } = req.params;

    const deletedCar = await Car.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );

       if (!deletedCar) throw new AppError(400, "Car is not exist");


    sendResponse(
      res,
      200,
      true,
      { Car: deletedCar },
      null,
      "Delete Car Success"
    );
  } catch (err) {
    // YOUR CODE HERE
    next(err);
  }
};

module.exports = carController;
