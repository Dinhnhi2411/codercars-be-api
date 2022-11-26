const mongoose = require("mongoose");
const Car = require("../models/Car");
const { sendResponse, AppError } = require("../helpers/utils.js");

const carController = {};

// CREATE CARS

carController.createCar = async (req, res, next) => {
  try {
    // YOUR CODE HERE
    const info = req.body;
    const carObj = new Car(info);
    if (!info) throw new AppError(402, "Bad Request", "Create Foo Error");

    await carObj.save(function (err) {
      if (err) {
        throw err;
      }
      console.log("saved");
    });
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
  try {
    // YOUR CODE HERE
    const { id } = req.params;
    const data = req.body;
    const options = { new: true };

    const updated = await Car.findByIdAndUpdate(id, data, options);
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
    if (!mongoose.isValidObjectId(id))
      throw new AppError(402, "Bad Request", "Invalid ID");
    const deletedCar = await Car.findByIdAndUpdate(
      id,
      { isDeleted: true },
      { new: true }
    );
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
