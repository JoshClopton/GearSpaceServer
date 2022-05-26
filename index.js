// Create Express app and also allow for app PORT to be optionally specified by an environment variable
const express = require("express");
// Middleware for creating a session id on server and a session cookie on client
const expressSession = require("express-session");
// cors package prevents CORS errors when using client side API calls
const cors = require("cors");
// Add http headers, small layer of security
const helmet = require("helmet");
// Passport library and Google Strategy
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
// Knex instance
const knex = require("knex")(require("./knexfile.js").development);

const cookieParser = require("cookie-parser");

// // Create Express app and also allow for app PORT to be optionally specified by an environment variable
const app = express();
const PORT = process.env.PORT || 8000;

//routes
// const shelvesRoutes = require("./routes/shelvesRoutes");
const auth = require("./routes/auth");
const shelves = require("./routes/shelvesRoutes");

// Require .env files for environment variables (keys and secrets)
require("dotenv").config();

// Enable req.body middleware
app.use(express.json());

// Initialize HTTP Headers middleware
app.use(helmet());

app.use(cookieParser());

// Enable CORS (with additional config options required for cookies)
app.use(
	cors({
		origin: true,
		credentials: true,
		methods: "GET, HEAD, PUT, PATCH, POST, OPTION, DELETE",
		preflightContinue: true,
	})
);

// Include express-session middleware (with additional config options required for Passport session)
app.use(
	expressSession({
		secret: process.env.SESSION_SECRET,
		resave: false,
		saveUninitialized: false,
	})
);

// =========== Passport Config ============

// Initialize Passport middleware
app.use(passport.initialize());

// Passport.session middleware alters the `req` object with the `user` value
// by converting session id from the client cookie into a deserialized user object.
// This middleware also requires `serializeUser` and `deserializeUser` functions written below
// Additional information: https://stackoverflow.com/questions/22052258/what-does-passport-session-middleware-do
app.use(passport.session());

// We can add multiple strategies with `passport.use` syntax
passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			callbackURL: process.env.GOOGLE_CALLBACK_URL,
			scope: ["profile"],
		},
		//Second argument is a callback function
		(_accessToken, _refreshToken, profile, done) => {
			// For our implementation we don't need access or refresh tokens.
			// Profile parameter will be the profile object we get back from Google

			// Check if we already have this user in our DB
			knex("users")
				.select("id")
				.where({ google_id: profile.id })
				.then((user) => {
					if (user.length) {
						// If user is found, pass the user object to serialize function

						return done(null, user[0]);
					} else {
						// If user isn't found, we create a record
						knex("users")
							.insert({
								google_id: profile.id,
								first_name: profile.name.givenName,
								last_name: profile.name.familyName,
								email: profile.emails[0].value,
								profile_image: profile.photos[0].value,
								is_public: false,
							})
							.then((userId) => {
								// Pass the user object to serialize function
								return done(null, { id: userId[0] });
							})
							.catch((err) => {
								console.log("Error creating a user", err);
							});
					}
				})
				.catch((err) => {
					console.log("Error fetching a user", err);
				});
		}
	)
);

// `serializeUser` determines which data of the auth user object should be stored in the session
// The data comes from `done` function of the strategy
// The result of the method is attached to the session as `req.session.passport.user = 12345`
passport.serializeUser((user, done) => {
	// Store only the user id in session
	done(null, user.id);
});

// `deserializeUser` receives a value sent from `serializeUser` `done` function
// We can then retrieve full user information from our database using the userId
passport.deserializeUser((userId, done) => {
	// Query user information from the database for currently authenticated user
	knex("users")
		.where({ id: userId })
		.then((user) => {
			// The full user object will be attached to request object as `req.user`
			done(null, user[0]);
		})
		.catch((err) => {
			console.log("Error finding user", err);
		});
});

// Additional information on serializeUser and deserializeUser:
// https://stackoverflow.com/questions/27637609/understanding-passport-serialize-deserialize

// =========================================

//set up
// app.use("/:shelfId", shelvesRoutes);
//set up auth end point and point to the routes folder
app.use("/auth", auth);
app.use("/shelves", shelves);

app.listen(PORT, () => {
	console.log(`🚀 Server running on port ${PORT}`);
});
