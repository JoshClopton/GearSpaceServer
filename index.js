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

//route setup described in step 4 of directions for google auth
app.get(
	"/auth/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
		session: false,
	})
);
app.get(
	"/auth/google/redirect",
	passport.authenticate("google", {
		session: false,
		failureRedirect: `https://localhost:3000/login`,
	}),
	(req, res) => {
		res.redirect(req.user); //req.user has the redirection_url
	}
);

app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
});

// Run the 2 lines below on terminal to install dependencies
// npm i express cors dotenv uuid
// npm i nodemon --save-dev
