const { Schema, model } = require("mongoose");

const placeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  comment: {
    type: String,
    required: true
  },
  image: {
    type: String,
    required: true
  },
  lat: {
    type: Number,
    required: true
  },
  lng: {
    type: Number,
    required: true
  },
  date: {
    type: String,
    require: true
  }
});

module.exports = model("Place", placeSchema);
