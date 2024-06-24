const express = require("express");
const app = express();
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const authroute = require("./routes/Auth.js");
const usersroute = require("./routes/Users.js");
const movies_route = require("./routes/Movies.js");
dotenv.config();

// connect with the databse here
// express by default do not accepts the json files so to accept it
app.use(express.json());
app.use(express.raw());
// this is an async function
mongoose.connect(process.env.DATABASE_URL).then(() => {
  console.log("database connected");
});

app.use("/api/auth", authroute);
app.use("/api/users", usersroute);
app.use("/api/movies", movies_route);

// for starting the server for request to be handled
// callback if server is succesfully runned
app.listen(process.env.PORT || 8080, () => {
  console.log("Backend server is running");
});
