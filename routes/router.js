const { Router } = require("express");
const translationRoutes = require("./translation.routes.js");
const userRoutes = require("./user.routes.js");
const blogRoutes = require("./blog.routes.js");
const router = Router();

router.use("/translations", translationRoutes);
router.use("/users", userRoutes);
router.use("/blogs", blogRoutes);

module.exports = router;