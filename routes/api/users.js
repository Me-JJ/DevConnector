const express =require("express");
const router=express.Router();
const {check,validationResult} = require("express-validator");
const gravatar =require("gravatar");
const jwt=require("jsonwebtoken");
const config=require("config");
const bcrypt =require("bcryptjs");

const User =require('../../models/User.js');
async function importNormalize()
{
    const normalize = await import("normalize-url");
}
importNormalize();

// @route           POST api/users
// @description     Register Users
// @access          Public

router.post("/",[
    check('name',"Name is required").notEmpty(),
    check('email',"Plese include a valid email").isEmail(),
    check('password',"Please enter a password with 6 or more characters").isLength({min:6})
],
async (req,res)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty())
    {
        return res.status(400).json({error:errors.array()});
    }

    // console.log(req.body);
    const {name,email,password}=req.body;

    try{

    //See if user Exists
    let user=await User.findOne({email:email});

    if(user)
    {
       return res.status(400).json({errors:[{msg:"User already exits"}]});
    }
    //Get user gravatar
    const avatar = normalize(
        gravatar.url(email, {
          s: '200',
          r: 'pg',
          d: 'mm'
        }),
        { forceHttps: true }
      );

    user=new User({
        name,
        email,
        avatar,
        password
    });

    const salt=await bcrypt.genSalt(10);

    user.password=await bcrypt.hash(password,salt);

    await user.save();
    //encrypt Password

    //return jsonWebToken
    const payload={
        user:{
            id:user.id  //same as mongo Db _id , it get abstracted as id through mongoose
        }
    }

    //creating jwt token 
    jwt.sign(
        payload,
        config.get("jwtSecret"),
        {expiresIn:36000}, ///when in production change this to 3600
        (err,token)=>{
            if(err) throw err;
            // console.log({token});
            return res.json({token});
        }
    );

    // res.send("User Registered");

    }
    catch(err)
    {
        // console.error(err);
        res.status(500).send("Server Error");
    }
    
})


module.exports=router;