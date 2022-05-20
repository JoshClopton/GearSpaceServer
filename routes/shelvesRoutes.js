const express = require("express");
// const { default: knex } = require("knex");
const router = express.Router();
require("dotenv").config();
const knex = require("knex")(require("../knexfile.js").development);

// const shelfController = require("../controller/shelfController");

// router.route("/").get(shelfController.index);
// router.route("/:shelfId").get(shelfController.index);

// module.exports = router;

router.get(`/:shelfId`, (req, res) => {
	console.log("🕵🏻‍♂️ req.user: ", req.user); //TODO: remove/comment
	console.log("🕵🏻‍♂️ req.params", req.params); //TODO: remove/comment

	knex("shelves")
		.where("shelf", req.params.shelfId)

		.then((data) => {
			console.log("🕵🏻‍♂️ data: ", data); //TODO: remove/comment

			res.status(200).json(data);
		})
		.catch((err) => {
			res.status(500).send("Error fetching shelves");
		});
});

// Create a new post route
router.post("/", (req, res) => {
	console.log("🕵🏻‍♂️ POSTreq.user: ", req.user); //TODO: .remove/comment
	console.log("🕵🏻‍♂️ req.body: ", req.body); //TODO: remove/comment

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
			item: req.body.item,
			description: req.body.description,
			shelf: req.body.shelf,
			qty: req.body.qty,
			location: req.body.location,
			notes: req.body.notes,
		})
		// .then((postId) => {
		// 	// Send newly created postId as a response
		// 	res.status(201).json({ newPostId: postId[0] });
		// })
		.catch(() => {
			res.status(500).json({ message: "Error creating a new post" });
		});
});

module.exports = router;
