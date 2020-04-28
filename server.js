const express = require("express");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "",
    password: "",
    database: "smart-brain",
  },
});

console.log(
  db
    .select("*")
    .from("users")
    .then((data) => console.log(data))
);

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  // res.send(database.users);
  res.send("it's working");
});

app.post("/signin", signin.handleSignin(db, bcrypt));

app.post("/register", (req, res) => {
  register.handleRegister(req, res, db, bcrypt);
});

app.get("/profile/:id", (req, res) => {
  profile.handleProfileGet(req, res, db);
});

app.put("/image", (req, res) => {
  image.handleImage(req, res, db);
});

app.post("/imageurl", (req, res) => {
  image.handleApiCall(req, res);
});

const PORT = process.env.PORT;
app.listen(PORT || 3000, () => {
  console.log(`Server is listening on port ${PORT}`);
});

// app.listen(3000, () => {
//   console.log("app is running on port 3000");
// });

/*
// --> res = this is working
// /signin --> POST = success/fail
// /register --> POST = user
// /profile/:userId --> GET = user
// /image --> PUT --> user
*/

// const database = {
//   users: [
//     {
//       id: "123",
//       name: "John",
//       password: "cookies",
//       email: "john@gmail.com",
//       entries: 0,
//       joined: new Date(),
//     },
//     {
//       id: "124",
//       name: "Sally",
//       password: "bananas",
//       email: "sally@gmail.com",
//       entries: 0,
//       joined: new Date(),
//     },
//   ],
// };
