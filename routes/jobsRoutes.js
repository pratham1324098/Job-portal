const express = require("express");
const userAuth = require("../middlewares/authMiddleware");
const {createJobcontroller,getAllJobsController, updateJobController, deleteJobController, jobStatsController} = require("../controllers/jobController");

const router = express.Router();

router. post("/create-job",userAuth,createJobcontroller)

router.get("/get-job",userAuth,getAllJobsController)

router.patch("/update-job/:id",userAuth,updateJobController)

router.delete("/delete-job/:id",userAuth,deleteJobController)

router.get("/job-stats",userAuth,jobStatsController)

module.exports = router;