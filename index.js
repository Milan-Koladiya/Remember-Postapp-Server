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

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
  console.log(chalk.bgGreen(`connected to port ${PORT}`));
});
