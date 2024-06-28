const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const { expressjwt } = require("express-jwt");
require("dotenv").config();

app.use(express.json());
app.use(morgan("dev"));

const connectToMongoDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_DB_URI);
    console.log("Connected to the MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    if (err.name === "MongoNetworkError") {
      console.error(
        "Network error, ensure that your network allows access to MongoDB Atlas."
      );
    } else if (err.name === "MongoServerError") {
      console.error(`MongoDB server error: ${err.message}`);
    } else if (err.name === "MongoParseError") {
      console.error("There is an error in your MongoDB URI format.");
    } else {
      console.error("Unknown error connecting to MongoDB:", err);
    }
  }
};
connectToMongoDB();

app.use("/auth", require("./routes/authRouter.js"));
app.use(
  "/api",
  expressjwt({ secret: process.env.SECRET, algorithms: ["HS256"] })
);
app.use("/api/issue", require("./routes/issueRouter.js"));
app.use("/api/comment", require("./routes/commentRouter.js"));
// app.get("/api", (req, res) => {
//   res.send("hello");
// });

app.use((err, req, res, next) => {
  console.log(err);
  if (err.name === "UnauthorizedError") {
    res.status(err.status);
  }
  return res.send({ errMsg: err.message });
});

app.listen(9000, () => {
  console.log("server is running on local port 9000");
});
