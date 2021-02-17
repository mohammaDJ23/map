const fs = require("fs");
const path = require("path");

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const helmet = require("helmet");
const bodyparser = require("body-parser");
const dotenv = require("dotenv");
const compression = require("compression");

const multerMiddleware = require("./middleware/image");
const graphqlMiddleware = require("./middleware/graphql");
const errorMiddleware = require("./middleware/error");

const imageController = require("./controller/image");

const app = express();

dotenv.config();

const PORT = process.env.PORT || 5000;

const accessLogStream = fs.createWriteStream(path.join(__dirname, "access.log"), {
  flags: "a"
});

app.use(bodyparser.json());
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(multerMiddleware);
app.use("/images", express.static(path.join(__dirname, "images")));
app.post("/form/image", imageController);
app.use("/graphql", graphqlMiddleware);
app.use(errorMiddleware);

(async () => {
  try {
    await mongoose.connect(process.env.DATABASE_URL, {
      useUnifiedTopology: true,
      useNewUrlParser: true
    });

    app.listen(PORT, () => {
      console.log("server is running");
    });
  } catch (error) {
    console.log(error);
  }
})();
