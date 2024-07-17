const express = require("express");
const router = express.Router();
const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const userController = require("../controllers/user");

router
  .route("/signup")
  .get(userController.renderSignup)
  .post(wrapAsync(userController.signUp));

router
  .route("/login")
  .get(userController.renderLogin)

  .post(
    saveRedirectUrl,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.logIn
  );

router.get("/logout", userController.logOut);

module.exports = router;
