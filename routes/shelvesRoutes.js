const express = require("express");
// const { default: knex } = require("knex");
const router = express.Router();
require("dotenv").config();
const knex = require("knex")(require("../knexfile.js").development);

// const shelfController = require("../controller/shelfController");

// router.route("/").get(shelfController.index);
// router.route("/:shelfId").get(shelfController.index);

// module.exports = router;

router.get("/", (req, res) => {
	knex
		.select("*")
		.from("shelves")
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((err) => {
			res.status(500).send("Error fetching shelves");
		});
});

// Create a new post route
router.post("/", (req, res) => {
	// If user is not logged in, we don't allow them to create a new post
	if (req.user === undefined)
		return res.status(401).json({ message: "Unauthorized" });

	// // Validate request body for required fields
	// if (!req.body.title || !req.body.content) {
	//   return res.status(400).json({ message: 'Missing post title or content fields' });
	// }

	// Insert new post into DB: user_id comes from session, title and content from a request body
	knex("shelves")
		.insert({
			user: req.user.id,
			title: req.body.title,
			content: req.body.content,
		})
		.then((postId) => {
			// Send newly created postId as a response
			res.status(201).json({ newPostId: postId[0] });
		})
		.catch(() => {
			res.status(500).json({ message: "Error creating a new post" });
		});
});

module.exports = router;
