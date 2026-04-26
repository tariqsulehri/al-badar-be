const mongoose = require("mongoose");
mongoose.promise = global.promise;
const dotenv = require("dotenv");

dotenv.config();

const { CLOUD_MONGO_URI } = process.env;

// Connecting to the cloud mongodb database
const connectwithCloudMongoDB = () => {
  // console.log("CLOUD_MONGO_URI :", CLOUD_MONGO_URI);
  return new Promise(async (resolve, reject) => {
    try {
      await mongoose.connect(CLOUD_MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useUnifiedTopology: true,
      });
      resolve("cloud database connection successfull!");
    } catch (err) {
      console.log(err);
      reject("cloud database connection failed");
    }
  });
};

module.exports = { connectwithCloudMongoDB };
