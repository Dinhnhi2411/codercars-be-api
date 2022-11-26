const express = require("express");
const csv = require("csvtojson");
const fs = require("fs");
const Car = require("./src/models/Car");
const mongoose = require("mongoose");
require('dotenv/config');

const refractorData = async () => {
  let data = JSON.parse(fs.readFileSync("./db.json", "utf-8"));

mongoose
.connect(process.env.MONGO_URI)
.then(()=> console.log("conected with mongodb"))
.catch((e)=> console.log("Error mongodb conection", e));

  let newData = await csv().fromFile("./data.csv");
  newData = Array.from(newData);

  newData = newData.map((car) => {
    return {
      make: car.Make,
      model: car.Model,
      price: parseInt(car.MSRP),
      release_date: parseInt(car.Year),
      size: car["Vehicle Size"],
      style: car["Vehicle Style"],
      transmission_type: car["Transmission Type"],
    };
  });

  data = newData;
  fs.writeFileSync("./db.json", JSON.stringify(data));
  // create document in dtb
  await Car.create(newData);
};

refractorData().catch((err) => console.log(err, "refract err"));