const express = require("express");
const app = express();
const path = require("path");
const user = require("./API/user");
const post = require("./API/post");
const cors = require("cors");
const chalk = require("chalk");

app.use(express.json());

app.use(cors());
app.use(user);
app.use(post);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("front-end/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "front-end", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(chalk.bgGreen(`connected to port ${PORT}`));
});
