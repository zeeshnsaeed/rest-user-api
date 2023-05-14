const express = require("express");

const users = require("./routes/users");
const connectDB = require("./db/connect");
const notFound = require("./middleware/notFound");
const errorHandlerMiddleware = require("./middleware/errorHandler");

require("dotenv").config();

const app = express();

const port = process.env.PORT || 8000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/v1/users", users);
app.use(notFound);
app.use(errorHandlerMiddleware);

// Connection with DB
const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, console.log(`Server is running on port ${port}`));
  } catch (err) {
    console.log(err);
  }
};

start();
