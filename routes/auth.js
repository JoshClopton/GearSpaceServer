const express = require("express");
const router = express.Router();

const passport = require("passport");

require("dotenv").config();

// Create a login endpoint which kickstarts the auth process and takes user to a consent page
// Here, you can also specify exactly what type of access you are requesting by configuring scope: https://docs.github.com/en/developers/apps/building-oauth-apps/scopes-for-oauth-apps
// ie: passport.authenticate("github", { scope: ["user:email", "repo"] })
router.get(
	"/google",
	passport.authenticate("google", {
		scope: ["profile", "email"],
		//TODO: may need to change this to false or true
		session: false,
	})
);

// GitHub auth Callback: http://localhost:5050/auth/google/redirect
// This is the endpoint that GitHub will redirect to after user responds on consent page
router.get(
	"/google/redirect",
	passport.authenticate("google", {
		session: false,
		failureRedirect: `${process.env.CLIENT_URL}/auth-fail`,
	}),
	(req, res) => {
		//Successful authentication, redirect to client-side application
		res.redirect(req.user); //req.user has the redirection_url
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

router.get("/login/", function (req, res, next) {
	res.render("login");
});

//testing the callback, delete this after test
router.get("/success-callback", (req, res) => {
	if (req.user) {
		res.status(200).json(req.user);
	} else {
		res.status(401).json({ message: "User is not logged in" });
	}
});

//end test

module.exports = router;
