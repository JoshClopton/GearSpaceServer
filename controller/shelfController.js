const knex = require("knex")(require("../knexfile").development);

//This is is grab the generic shelves on page load...Get /
exports.index = (_req, res) => {
	knex("shelves")
		.select("shelf", "image")
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((err) => res.status(400).send(`Error retrieving Shelves ${err}`));
};

//This is an endpoint to grab all the shelves for a particular user.../:shelfId
exports.userShelf = (_req, res) => {
	knex("user_shelves")
		.select(
			"item",
			"image",
			"Qty",
			"location",
			"description",
			"notes",
			"comments"
		)
		.where({ id: request.params.shelfId })
		.then((data) => {
			res.status(200).json(data);
		})
		.catch((err) => res.status(400).send(`Error retrieving Shelves ${err}`));
};
