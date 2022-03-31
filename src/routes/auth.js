const express = require("express");
const router = express.Router();

const {
   signup,
   signin,
   signout,
   requireSignin,
   isAdmin,
   isAuth,
} = require("../controllers/auth");
const {
   userSignupValidator,
   userSigninValidator,
} = require("../validator/index");

router.post("/signup", requireSignin, isAdmin, userSignupValidator, signup);
router.post("/signin", userSigninValidator, signin);
router.get("/signout", signout);

module.exports = router;
