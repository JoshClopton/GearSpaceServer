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
	knex("shelves")
		.where("shelf", req.params.shelfId)
		.where("user", req.user.id)

		.then((data) => {
			res.status(200).json(data);
		})
		.catch((err) => {
			res.status(500).send("Error fetching shelves");
		});
});

router.get(`/`, (req, res) => {
	knex
		.column("shelf")
		.select()
		.from("shelves")
		.where("user", req.user.id)

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
			item: req.body.item,
			// description: req.body.description,
			shelf: req.body.shelf,
			qty: req.body.qty,
			location: req.body.location,
			notes: req.body.notes,
			image: req.body.image,
		})
		.then((postId) => {
			// Send newly created pdostId as a response
			res.status(201).json({ newPostId: postId[0] });
		})
		.catch(() => {
			res.status(500).json({ message: "Error creating a new post" });
		});
});

router.delete("/delete", (req, res) => {
	knex("shelves")
		.where("user", req.user.id)
		.where("id", req.body.id)
		.del()
		.then((data) => {
			res.sendStatus(204);
		})
		.catch(() => {
			res.status(500).json({ message: "Error deleting shelf item" });
		});
});

router.patch("/edit", (req, res) => {
	knex("shelves")
		.where("user", req.user.id)
		.where("id", req.body.item)
		.update({
			// description: req.body.description,
			qty: req.body.qty,
			notes: req.body.notes,
			location: req.body.location,
			shelf: req.body.shelf,
		})
		.then((data) => {
			console.log("🕵🏻‍♂️ data from patch: ", data); //TODO: remove/comment

			res.status(200).json(data);
		})
		.catch((err) => {
			res.status(500).send("Error fetching shelves");
		});
});

module.exports = router;
