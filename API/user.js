const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const multer = require("multer");
const jwt = require("jsonwebtoken");
const sendMail = require("../sendmail/sendmail");
const auth = require("../auth/auth");

const User = require("../model/user");
const postModel = require("../model/post");

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "Uploads/");
  },
  // filename: (req, file, cb) => {
  //     cb(null, file.originalname)
  // }
});

const upload = multer({
  storage: Storage,
});

// ************* User SignUp ***************
router.post("/signup", upload.single("file"), async (req, res) => {
  console.log("signup router");
  try {
    let user = req.body;
    if (!user.Username || !user.Emailid || !user.Password || !user.avtar) {
      return res.status(400).json({ error: "Please fill all the field" });
    }
    console.log(user);
    const userFound = await User.findOne({ Username: user.Username });
    console.log("xxxxxx", userFound);
    if (userFound) {
      console.log(user);
      return res.status(204).send({ errmessage: "Please fill all the field" });
    }
    await bcrypt.hash(user.Password, 8, (err, hash) => {
      user.Password = hash;
      const userData = new User(user);
      userData
        .save()
        .then(() => {
          // sendMail(user.Emailid)
          res.status(200).send("user signup succesfully");
        })
        .catch(() => {
          res.status(400).json({ error: "Error to sending data" });
        });
      res.status(200).send("user signup success");
    });
  } catch (error) {
    res.status(400).json({ error: "there is some error" });
  }
});

// ************* User login ***************

router.post("/login", async (req, res) => {
  const userlogin = req.body;
  if (!userlogin.Username || !userlogin.Password) {
    return res.status(400).json({ error: "Please fill all the field" });
  }
  const users = await User.findOne({ Username: userlogin.Username });
  if (!users) {
    return res.status(400).json({ error: "username invalid" });
  }
  const compare = await bcrypt.compare(userlogin.Password, users.Password);
  if (!compare) {
    return res.status(400).json({ error: "Password invalid" });
  }
  const token = jwt.sign({ _id: users._id }, "thisistoken", {
    expiresIn: "24h",
  });
  users.tokens.push({ token });
  await users.save();
  (users.tokens = []),
    (users.Password = ""),
    (users.avtar = ""),
    (users._id = "");
  res.status(200).send({
    token: token,
    user: users,
  });
});

// ************* User avtar upload ***************

router.post("/uploadavtar", auth, upload.single("file"), async (req, res) => {
  try {
    const user = req.user;
    if (!req.file.filename) {
      return res.status(400).json({ error: "please choose image" });
    }
    user.avtar = req.file.filename;
    console.log(user);
    await user
      .save()
      .then(() => {
        res.status(200).send("image upload succesfully");
      })
      .catch((err) => {
        console.log(err);
      });
  } catch (error) {
    res.status(400).json({ error: "there is some error" });
  }
});

// ************* User update ***************

router.patch("/updateuser", auth, async (req, res) => {
  const ruser = req.user;
  const duser = req.body;
  const validProperty = ["Username", "Emailid", "Password"];
  const property = Object.keys(duser);
  const rprope = property.filter((prope) => validProperty.includes(prope));
  if (rprope.length !== property.length) {
    return res.status(400).json({ error: "invalid feild" });
  }
  if (duser.Password) {
    const password = await bcrypt.hash(duser.Password, 8);
    duser.Password = password;
  }
  await User.findByIdAndUpdate(ruser._id, duser)
    .then((data) => {
      res.status(200).send("Update success");
    })
    .catch((err) => {
      res.status(400).send({ error: "invalid input" });
    });
});

// ************* User logout ***************

router.post("/logout", auth, async (req, res) => {
  const ruser = req.user;
  const token = req.token;
  const remainToken = await ruser.tokens.filter(
    (tokenobj) => tokenobj.token !== token
  );
  ruser.tokens = remainToken;
  ruser.save();
  res.status(200).send("logout success");
});

// ************* User delete ***************

router.delete("/userdelete", auth, async (req, res) => {
  const ruser = req.user;
  await User.findByIdAndDelete(ruser._id)
    .then(() => {
      // const postedData = postModel.find({Postedby:ruser._id})
      // console.log(postedData)
      // postedData.remove()
      res.status(200).send("user delete succesfully");
    })
    .catch(() => {
      res.status(400).json({ error: "error" });
    });
});

module.exports = router;
