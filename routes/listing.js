const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isOwner, validateListing } = require("../middleware");
const { isLoggedIn } = require("../middleware");
const listingController = require("../controllers/listings");

//Index Route
router.get("/", wrapAsync(listingController.index));

// New Route
router.get("/new", isLoggedIn, listingController.renderNewForm);

//Show Route
router.get("/:id", wrapAsync(listingController.showListing));

// Create Route
router.post(
  "/",
  validateListing,
  isLoggedIn,
  wrapAsync(listingController.createListing)
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(listingController.renderEditForm)
);

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(listingController.updateListing)
);

//Delete Route
router.delete("/:id", isLoggedIn, wrapAsync(listingController.destroyListing));

module.exports = router;
