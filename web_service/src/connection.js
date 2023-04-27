const { MONGO_DB } = process.env;

// connection.js
const mongoose = require("mongoose");
const connection = "mongodb://mongo:27017/idea-tracker";
const connection2 = MONGO_DB;

const connectDb = () => {
  mongoose.set("strictQuery", false);
  return mongoose.connect(connection2, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
};
module.exports = connectDb;
