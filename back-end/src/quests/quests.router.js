/**
 * Defines the router for quests resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./quests.controller");
const methodNotAllowed = require("../errors/methodNotAllowed");

router
.route("/")
.get(controller.list)
.all(methodNotAllowed);

router
.route("/new")
.post(controller.create)
.all(methodNotAllowed);

router
.route("/:quest_id")
.get(controller.read)
.put(controller.update)
.delete(controller.delete)
.all(methodNotAllowed);

module.exports = router;