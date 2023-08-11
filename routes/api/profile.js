// jswwebtokens handleimport express from "express";
const express =require("express");
const router=express.Router();
const auth=require("../../middleware/auth");
const Profile = require("../../models/Profile");
const {check,validationResult} = require("express-validator");
const User = require("../../models/User");

// @route    GET api/profile/me
// @desc     Get current User profile
// @access   Private
router.get("/me",auth,async (req,res)=>{

    try{
        const profile=await Profile.findOne({user:req.user.id}).populate('user',['name','avatar']);

        if(!profile)
        {
            return res.status(400).json({msg:"There is no profile for this user"});
        }

        res.json(profile);

    }catch(err)
    {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
})

// @route    POST api/profile
// @desc     Create or Update user profile
// @access   Private
router.post("/",[auth,[
    check('status',"Status is required").notEmpty(),
    check('skills',"Skills is required").notEmpty()
]],
async (req,res)=>{
    const errors=validationResult(req);
    if(!errors.isEmpty())
    {
        return res.status(400).json({errors:errors.array()});
    }

    // res.json(req.body);

    //destructuring the req.body 
    const {company,website,location,bio,
        status,githubname,skills,youtube,
        facebook,twitter,instagram,linkedin}=req.body;

    //build profile Object: checking for the fields that were sent through body
    const profileFields={};
    // console.log("studying this to get how to parse it->",req);
    profileFields.user=req.user.id;    

    if(company) profileFields.company=company;
    if(website) profileFields.website=website;
    if(location) profileFields.location=location;
    if(bio) profileFields.bio=bio;
    if(status) profileFields.status=status;
    if(githubname) profileFields.githubname=githubname;
    if(skills)
    {
        profileFields.skills=skills.split(",").map((skill)=>skill.trim());
    }
    // res.send(profileFields.skills)

    // BUILD SOCIAL OBJECT 
    profileFields.social={};
    if(youtube) profileFields.social.youtube=youtube;
    if(twitter) profileFields.social.twitter=twitter;
    if(facebook) profileFields.social.facebook=facebook;
    if(instagram) profileFields.social.instagram=instagram;
    if(linkedin) profileFields.social.linkedin=linkedin;

    try{
        let profile=await Profile.findOne({user:req.user.id});

        if(profile)
        {
            profile=await Profile.findOneAndUpdate(
                { user:req.user.id },
                { $set: profileFields},
                { new: true}
            );

            return res.json(profile);
        }

        //create a profile
        profile=new Profile(profileFields);
        await profile.save();
        res.json(profile);
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


//@route    api/profile
//@desc     Get all profiles
//@access   PUBLIC
router.get("/",async(req,res)=>{
    try{
        const profiles=await Profile.find().populate("user",["name","avatar"]);
        res.json(profiles);
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});


//@route    api/profile/users/:user_id
//@desc     Get profile by userID
//@access   PUBLIC
router.get("/user/:user_id",async(req,res)=>{
    try{
        const profiles=await Profile.findOne({user:req.params.user_id}).populate("user",["name","avatar"]);
        if(!profiles)
        {
            return res.status(400).json({msg:"Profile not found!"});
        }

        res.json(profiles);
    }
    catch(err)
    {
        if(err.kind=="ObjectId")
        {
            return res.status(400).json({msg:"Profile not found!"});
        }
        res.status(500).send("Server Error");
    }
});


//@route    DELETE api/profile
//@desc     delete profile,user and posts
//@access   PRIVATE 
router.delete("/",auth,async(req,res)=>{
    try{
        //@todo - remove users post

        //remove profile
        await Profile.findOneAndRemove({user:req.user.id});
        
        //remove user
        await User.findOneAndRemove({_id:req.user.id});

        res.json({msg:"User Deleted"});
    }
    catch(err)
    {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});
module.exports=router;