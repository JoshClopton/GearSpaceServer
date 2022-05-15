// const express = require("express");
// const router = express.Router();

// // following google strategies directions outlined in step 5 of https://dev.to/asim_ansari7/setting-up-social-logins-with-node-js-and-passport-js-1m16
// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20").Strategy;
// const jwt = require("jsonwebtoken");
// passport.use(
// 	new GoogleStrategy(
// 		{
// 			callbackURL: `http://localhost:5500/auth/google/redirect`, //same URI as registered in Google console portal
// 			clientID: process.env.GOOGLE_CLIENT_ID, //replace with copied value from Google console
// 			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
// 		},

// 		//accessToken are used to make API requests on behalf of a user. Not required in our app.
// 		//access tokens have a limited lifetime so a refreshToken can be used to obtain new access tokens.

// 		// The first argument to done is the error object which is null in our code thus telling passport that things are fine and there is no error.
// 		async (accessToken, refreshToken, profile, done) => {
// 			try {
// 				let user_email = profile.emails && profile.emails[0].value; //profile object has the user info
// 				let [user] = await db("users")
// 					.select(["id", "name", "email"])
// 					.where("email", user_email); //check whether user exist in database
// 				let redirect_url = "";
// 				if (user) {
// 					const token = jwt.sign(user, process.env.JWT_SECRET, {
// 						expiresIn: "1h",
// 					}); //generating token
// 					redirect_url = `http://localhost:3000/${token}`; //registered on FE for auto-login
// 					return done(null, redirect_url); //redirect_url will get appended to req.user object : passport.js in action
// 				} else {
// 					redirect_url = `http://localhost:3000/user-not-found/`; // fallback page
// 					return done(null, redirect_url);
// 				}
// 			} catch (error) {
// 				done(error);
// 			}
// 		}
// 	)
// );

// //TODO: App verification, need to look into this.
// // We can Submit our app for Verification from the OAuth Consent Screen(Google Console Portal) after providing the appropriate Authorized domain, Homepage, Term of Service, and privacy policy links. The process takes around 4-5 days if no sensitive scope is being requested. A few rounds of follow-up emails from the google team if needed and that's it.
