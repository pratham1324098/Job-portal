const express = require("express");
const userAuth = require("../middlewares/authMiddleware");
const testPostController = require("../controllers/testController");

const router = express.Router();
router.post('/test-post',userAuth, testPostController); // Added parentheses to call testController
module.exports = router;
 