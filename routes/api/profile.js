// jswwebtokens handleimport express from "express";
const express = require("express");
const router = express.Router();
const auth = require("../../middleware/auth");
const Profile = require("../../models/Profile");
const { check, validationResult } = require("express-validator");
const axios = require("axios");
const config = require("config");
const User = require("../../models/User");
const Post = require("../../models/Post");

// @route    GET api/profile/me
// @desc     Get current User profile
// @access   Private
router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      "user",
      ["name", "avatar"]
    );

    if (!profile) {
      return res.status(400).json({ msg: "There is no profile for this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

// @route    POST api/profile
// @desc     Create or Update user profile
// @access   Private
router.post(
  "/",
  [
    auth,
    [
      check("status", "Status is required").notEmpty(),
      check("skills", "Skills is required").notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // res.json(req.body);
    // console.log("at backend req->body---->", req.body);
    //destructuring the req.body
    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    //build profile Object: checking for the fields that were sent through body
    const profileFields = {};
    // console.log("studying this to get how to parse it->",req);
    profileFields.user = req.user.id;

    if (company) profileFields.company = company;
    if (website) {
      profileFields.website = website;
    }
    if (location) profileFields.location = location;
    if (bio) profileFields.bio = bio;
    if (status) profileFields.status = status;
    if (githubusername) profileFields.githubusername = githubusername;
    if (skills) {
      profileFields.skills = skills.split(",").map((skill) => skill.trim());
    }
    // res.send(profileFields.skills)

    // BUILD SOCIAL OBJECT
    profileFields.social = {};
    if (youtube) profileFields.social.youtube = youtube;
    if (twitter) profileFields.social.twitter = twitter;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (linkedin) profileFields.social.linkedin = linkedin;

    try {
      // console.log(
      //   "\n-----------------\nat backend prfileBody---->",
      //   profileFields
      // );
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        );

        // console.log("\n\nafter findone--->", profile);
        return res.json(profile);
      }

      //create a profile
      profile = new Profile(profileFields);
      await profile.save();
      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  }
);

//@route    api/profile
//@desc     Get all profiles
//@access   PUBLIC
router.get("/", async (req, res) => {
  try {
    const profiles = await Profile.find().populate("user", ["name", "avatar"]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    api/profile/users/:user_id
//@desc     Get profile by userID
//@access   PUBLIC
router.get("/user/:user_id", async (req, res) => {
  try {
    const profiles = await Profile.findOne({
      user: req.params.user_id,
    }).populate("user", ["name", "avatar"]);
    if (!profiles) {
      return res.status(400).json({ msg: "Profile not found!" });
    }

    res.json(profiles);
  } catch (err) {
    if (err.kind == "ObjectId") {
      return res.status(400).json({ msg: "Profile not found!" });
    }
    res.status(500).send("Server Error");
  }
});

//@route    DELETE api/profile
//@desc     delete profile,user and posts
//@access   PRIVATE
router.delete("/", auth, async (req, res) => {
  try {
    //  remove users post
    await Post.deleteMany({ user: req.user.id });

    //remove profile
    await Profile.findOneAndRemove({ user: req.user.id });

    //remove user
    await User.findOneAndRemove({ _id: req.user.id });

    res.json({ msg: "User Deleted" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

//@route    PUT api/profile/experience
//@desc     add profile experience
//@access   PRIVATE
router.put(
  "/experience",
  [
    auth,
    [
      check("title", "Title is Required").notEmpty(),
      check("company", "Company is required").notEmpty(),
      check("from", "From date is required").notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExp = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.experience.unshift(newExp);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server Error");
    }
  }
);

//@route    DELETE api/profile/experience/:exp_id
//@desc     delete experience from Profile using experience id
//@access   PRIVATE

router.delete("/experience/:exp_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // get index that matches the exp_id
    const removeIndex = profile.experience
      .map((item) => item.id)
      .indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});

//@route    PUT api/profile/education
//@desc     add profile education
//@access   PRIVATE
router.put(
  "/education",
  [
    auth,
    [
      check("school", "school is Required").notEmpty(),
      check("degree", "degree is required").notEmpty(),
      check("from", "From date is required").notEmpty(),
      check("fieldofstudy", "Field of study  is required").notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { school, degree, fieldofstudy, from, to, current, description } =
      req.body;

    const newEdu = {
      school,
      degree,
      fieldofstudy,
      from,
      to,
      current,
      description,
    };
    try {
      const profile = await Profile.findOne({ user: req.user.id });

      profile.education.unshift(newEdu);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("server Error");
    }
  }
);

//@route    DELETE api/profile/education/:edu_id
//@desc     delete education from Profile using education id
//@access   PRIVATE

router.delete("/education/:edu_id", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id });

    // get index that matches the exp_id
    const removeIndex = profile.education
      .map((item) => item.id)
      .indexOf(req.params.edu_id);

    profile.education.splice(removeIndex, 1);

    await profile.save();
    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("server Error");
  }
});

// @route    GET api/profile/github/:username
// @desc     Get user repos from Github
// @access   Public
router.get("/github/:username", async (req, res) => {
  try {
    const uri = encodeURI(
      `https://api.github.com/users/${req.params.username}/repos?per_page=5&sort=created:asc`
    );
    const headers = {
      "user-agent": "node.js",
      Authorization: `token ${config.get("githubToken")}`,
    };

    const gitHubResponse = await axios.get(uri, { headers });
    return res.json(gitHubResponse.data);
  } catch (err) {
    console.error(err.message);
    return res.status(404).json({ msg: "No Github profile found" });
  }
});

module.exports = router;
