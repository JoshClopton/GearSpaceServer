const router = require("express").Router();
const shelfController = require("../controller/shelfController");

router.route("/").get(shelfController.index);
router.route("/:shelfId").get(shelfController.index);

module.exports = router;
