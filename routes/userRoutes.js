const express = require("express");
const userAuth = require("../middlewares/authMiddleware.js");
const updateUserController = require("../controllers/userController.js");
const getUserController = require("../controllers/userController.js");

const router = express.Router();

router.post("/getUser",userAuth,getUserController);
router.put("/update-user", userAuth, updateUserController);

module.exports = router;