const express = require("express");
const cors = require("cors");
const app = express();
const uuid = require("uuid");
const passport = require("passport.js");

const authRouter = require("./routes/auth.js");
const loginRouter = require("./routes/login.js");

// const itemRoute = require("./routes/items");

require("dotenv").config();
const PORT = process.env.PORT || 8080;

app.use(express.json());

app.use(express.static("assets"));

app.use(cors());

app.use("/", loginRouter);
app.use("/", authRouter);

// app.use("/items", itemRoute);

// passport.use(new LocalStrategy(
// 	function(username, password, done) {
// 	  User.findOne({ username: username }, function (err, user) {
// 		if (err) { return done(err); }
// 		if (!user) { return done(null, false); }
// 		if (!user.verifyPassword(password)) { return done(null, false); }
// 		return done(null, user);
// 	  });
// 	}
//   ));

app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
});

// Run the 2 lines below on terminal to install dependencies
// npm i express cors dotenv uuid
// npm i nodemon --save-dev
