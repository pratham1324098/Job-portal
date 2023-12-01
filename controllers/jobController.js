const jobModels  = require("../models/jobModels");
const mongoose = require('mongoose');
const moment = require("moment")

const createJobcontroller = async(req,res,next) => {
    const {company,position}=req.body;
    if(!company||!position){
        next("Please provide all fields")
    }
    req.body.createdBy = req.user.userId
    const job  = await jobModels.create(req.body)
    res.status(201).json({job});
}
const getAllJobsController = async (req,res,next) => {
    const {status,workType,search,sort} = req.query;
    const queryObject = {
        createdBy:req.user.userId,
    };
    if(status && status!=="all"){
        queryObject.status = status;
    }
    if(workType && workType!=='all'){
        queryObject.workType=workType;
    }
    if(search){
        queryObject.position = {$regex:search,$options:'i'}
    }
    let queryResult = jobModels.find(queryObject);

    if(sort === 'latest'){
        queryResult = queryResult.sort("-createdAt")
    }
    if(sort === 'oldest'){
        queryResult = queryResult.sort("createdAt")
    }if(sort === 'a-z'){
        queryResult = queryResult.sort("position")
    }if(sort === 'z-a'){
        queryResult = queryResult.sort("-position")
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1)*limit
    queryResult = queryResult.skip(skip).limit(limit)
    const totalJobs = await jobModels.countDocuments(queryResult)
    const numOfPage = Math.ceil(totalJobs/limit)
    const jobs = await queryResult
    console.log('Total Jobs:', totalJobs);
    console.log('Jobs:', jobs);
    console.log('Number of Pages:', numOfPage);

    // const jobs = await jobModels.find({createdBy:req.user.userId})
    res.status(200).json({
        totalJobs,
        jobs,
        numOfPage
    })
};
const updateJobController = async (req,res,next) =>{
    const {id} = req.params;
    const {company,position} = req.body;
    if(!company || !position){
        next("Please Provide all Fields")
    }
    const job = await jobModels.findOne({_id:id})
    if(!job){
        next(`No job found with this id : ${id}`)
    }
    if(!req.user.userId === job.createdBy.toString()){
        next("You are not Authorized to update this Job")
        return 
    }
    const upadateJob =  await jobModels.findOneAndUpdate({_id:id},req.body,{
        new:true,
        runValidators:true
    })
    res.status(200).json({upadateJob});
}
const deleteJobController = async (req,res,next) => {
    const {id}= req.params
    const job = await jobModels.findOne({_id:id})
    if(!job){
        next(`No Job found with this ID ${id}`)
    }
    if(!req.user.userId === job.createdBy.toString()){
        next("You are not authorize to delete this job.")
        return ;
    }
    await job.deleteOne();
    res.status(200).json({message:"Success, Job Deleted! "});
}
const jobStatsController = async(req,res) => {
    console.log(req.user)
    const stats = await jobModels.aggregate([
        {
            $match:{
                createdBy: new mongoose.Types.ObjectId(req.user.userId),
                // workLocation: { $in: ['Vietnam', 'India', 'Brazil'] }
            },
        },{
            $group:{
                _id:'$status',
                count:{$sum:1},
            }
        }   
    ]);
    const defaultStats = {
        pending : stats.pending || 0,
        reject: stats.reject || 0,
        interview: stats.interview || 0,
    }
    let monthlyApplication = await jobModels.aggregate([
        {
            $match:{
                createdBy: new mongoose.Types.ObjectId(req.user.userId)
            }
        },
        {
            $group:{
                _id:{
                    year:{$year:'$createdAt'},
                    month:{$month:'$createdAt'}
                },
                count:{
                    $sum:1,
                 },
            },
        },
    ]);
    monthlyApplication = monthlyApplication.map(item =>{
        const {_id:{year,month},count} = item
        const date =  moment().month(month-1).year(year).format('MMM Y')
        return {date,count}
    }).reverse();
    res.status(200).json({totalJob:stats.length,defaultStats,monthlyApplication})
}

module.exports = {createJobcontroller,getAllJobsController,updateJobController,deleteJobController,jobStatsController};