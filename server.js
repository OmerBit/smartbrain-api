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
    connectionString: process.env.DATABASE_URL,
    ssl: true,
  },
});

console.log(
  db
    .select("*")
    .from("users")
    .then((data) => console.log(data))
);

const app = express();
// const corsOptions = {
//   origin: "http://localhost:3000",
// };
// const corsOptions = {
//   origin: "https://git.heroku.com/damp-garden-24642.git",
// };

app.use(express.json());
app.use(cors());
app.options("*", cors());
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization, Content-Length"
  );

  // intercept OPTIONS method
  if ("OPTIONS" == req.method) {
    res.send(200);
  } else {
    next();
  }
});

app.get("/", (req, res) => {
  // res.send(database.users);
  res.send("it's working");
});
// app.get("/", cors(corsOptions), (req, res) => {
//   // res.send(database.users);
//   res.send("it's working");
// });

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

/*
Heads up! In the next video we are going to connect our Knex.js library to our Heroku Database. If you are encountering an issue following the next video and you are seeing errors like...

Error: self signed certificate
or
code: 'DEPTH_ZERO_SELF_SIGNED_CERT'



This is due to a line in the code you will see in the next video where we set ssl: true

In the case that you see the error above, it may have to do with the fact that we are using the free version of Heroku. If you encounter this issue (and only if you do), you can resolve it by adding the below on line 11 in the server.js file:

process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0; 
Note that this is not secure for use in production, and to only use for local development (which isn't a big issue for us because this is a personal project app with no real users)
*/

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
