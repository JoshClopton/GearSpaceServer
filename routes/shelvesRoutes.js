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
		.then((shelves) => {
			res.status(200).json(shelves);
		});
});

module.exports = router;
