const express =require("express");
const router=express.Router();

// @route    GET api/users
// @desc     Test Routes
// @access   Public

router.get("/",(req,res)=>{
    res.send("Post Route");
})


module.exports=router;