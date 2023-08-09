const express =require("express");
const router=express.Router();
const {check,validationResult} = require("express-validator");

// @route           POST api/users
// @description     Register Users
// @access          Public

router.post("/",[
    check('name',"Name is required").notEmpty(),
    check('email',"Plese include a valid email").isEmail(),
    check('password',"Please enter a password with 6 or more characters").isLength({min:6})
],
(req,res)=>{
    const errors=validationResult(req);

    if(!errors.isEmpty())
    {
        return res.status(400).json({error:errors.array()});
    }
    res.send("User Route");
})


module.exports=router;