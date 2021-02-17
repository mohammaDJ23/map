const validator = require("validator").default;
const moment = require("moment");

const Place = require("../model/place");

module.exports = {
  // send all markers to client

  async getAllMarkers() {
    let markers;

    // get all markers

    try {
      markers = await Place.find();
    } catch (error) {
      throw error;
    }

    return [
      ...markers.map(({ _doc }) => {
        return {
          ..._doc,
          isDescriptionActive: false,
          isMarkerActive: true,
          _id: _doc._id.toString()
        };
      })
    ];
  },

  // create a new marker

  async createNewPlace({ inputs }) {
    const { name, comment, image, lat, lng } = inputs;
    const errors = [];

    // check all inputs

    if (!validator.isLength(name.trim(), { min: 3, max: 30 }) && !validator) {
      errors.push({ message: "name length should be between 3 - 30" });
    } else if (!validator.isLength(comment.trim(), { min: 10, max: 150 })) {
      errors.push({
        message: "comment length should be between 10 - 150"
      });
    } else if (!validator.isLength(image.trim(), { min: 1 })) {
      errors.push({ message: "please pick an image" });
    } else if (
      !validator.isFloat(String(lat), { min: -90, max: 90 }) &&
      !validator.isFloat(String(lng), { min: -180, max: 180 })
    ) {
      errors.push({
        message: "latitude and longitude should be between -90 - 90 and -180 - 180"
      });
    }

    // if one of inputs was invalid send error to client

    if (errors.length > 0) {
      const error = new Error(errors[0].message);
      error.code = 422;
      throw error;
    }

    // create new marker

    const place = new Place({
      name,
      comment,
      image,
      lat: lat.toFixed(4),
      lng: lng.toFixed(4),
      date: moment().format("MMMM Do YYYY, h:mm:ss a").toString()
    });

    let plc;

    // save marker in database

    try {
      plc = await place.save();
    } catch (error) {
      throw error;
    }

    return {
      ...plc._doc,
      isDescriptionActive: false,
      isMarkerActive: true,
      _id: plc._doc._id.toString()
    };
  }
};
