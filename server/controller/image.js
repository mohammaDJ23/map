module.exports = (req, res, next) => {
  if (!req.file) {
    const error = new Error("please pick an image");
    error.code = 422;
    return next(error);
  }

  return res.status(201).json({ image: req.file.path });
};
