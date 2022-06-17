const express = require("express");
const router = express.Router();

const passport = require("passport");

require("dotenv").config();

router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
	})
);

router.get(
	"/google/redirect",
	passport.authenticate("google", {
		failureRedirect: `${process.env.CLIENT_URL}/auth-fail`,
	}),
	(req, res) => {
		res.redirect("https://gear-space-client.herokuapp.com/shelves");
	}
);

//!!!PROTECTED ENDPOINT

// User profile endpoint that requires authentication
router.get("/profile", (req, res) => {
	// Passport stores authenticated user information on `req.user` object.
	// Comes from done function of `deserializeUser`

	// If `req.user` isn't found send back a 401 Unauthorized response
	if (req.user === undefined)
		return res.status(401).json({ message: "Unauthorized" });
	// If user is currently authenticated, send back user info
	res.status(200).json(req.user);
});

// Create a logout endpoint

// /auth/logout
router.get("/logout", (req, res) => {
	// Passport adds the logout method to request, it will end user session
	req.logout();

	// Redirect the user back to client-side application
	res.redirect(process.env.CLIENT_URL);
});

module.exports = router;
