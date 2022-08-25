const express = require("express");
const router = express.Router();
require("dotenv").config();
const knex = require("knex")(require("../knexfile.js").development);

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
//Grab the users shelves from the database
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
  // Insert new post into DB: user_id comes from session, title and content from a request body
  knex("shelves")
    .insert({
      user: req.user.id,
      item: req.body.item,
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
//Route to delete items in a shelf
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
      qty: req.body.qty,
      notes: req.body.notes,
      location: req.body.location,
      shelf: req.body.shelf,
    })
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      res.status(500).send("Error fetching shelves");
    });
});

module.exports = router;
