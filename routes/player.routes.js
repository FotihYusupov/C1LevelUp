const { Router } = require("express");
const uploadMiddleware = require("../middlewares/upload.middleware.js");
const playerController = require("../controller/player.controller.js");
const playerRoutes = Router();

playerRoutes.get("/", playerController.getAll);
playerRoutes.get("/ads", playerController.getAllAds);
playerRoutes.post("/send", uploadMiddleware, playerController.sendMessage);

module.exports = playerRoutes;