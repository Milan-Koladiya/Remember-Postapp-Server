const mongoose = require("mongoose");

const connection = mongoose
  .connect(
    "mongodb+srv://test:test123@cluster0.vdwtb.mongodb.net/Social-Media?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => {
    console.log("connecticon successfully");
  })
  .catch((err) => {
    console.log(err);
  });
module.exports = connection;
