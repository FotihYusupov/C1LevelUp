const { Router } = require("express");
const authMiddleware = require("../middlewares/auth.middleware.js");
const userRoutes = require("./user.routes.js");
const channelRoutes = require("./channel.routes.js");
const playerRoutes = require("./player.routes.js");

const router = Router();

router.use("/users", userRoutes);
router.use("/channels", authMiddleware, channelRoutes);
router.use("/players", authMiddleware, playerRoutes);

module.exports = router;
