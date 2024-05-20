const { Router } = require("express");
const channelController = require("../controller/channel.controller.js");
const channelRoutes = Router();

channelRoutes.get("/", channelController.getAllChannels);
channelRoutes.post("/", channelController.createChannel);
channelRoutes.put("/:id", channelController.updateChannel);
channelRoutes.delete('/:id', channelController.deleteChannel);

module.exports = channelRoutes;