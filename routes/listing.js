const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync");
const Listing = require("../models/listing");
const { isOwner, validateListing } = require("../middleware");
const { isLoggedIn } = require("../middleware");

// Log the imports to check if they are correctly imported
console.log({ wrapAsync, Listing, isLoggedIn, isOwner, validateListing });

// Simplified route for testing
router.get("/test", (req, res) => {
  res.send("Test route working");
});

//Index Route
router.get(
  "/",
  wrapAsync(async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
  })
);

// New Route
router.get("/new", isLoggedIn, (req, res) => {
  res.render("listings/new");
});

//Show Route
router.get(
  "/:id",
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id)
      .populate({
        path: "review",
        populate: {
          path: "author",
        },
      })
      .populate("owner");
    if (!listing) {
      req.flash("error", "Listing Does Not Exist");
      res.redirect("/listings");
    }
    res.render("listings/show", { listing });
  })
);

// Create Route
router.post(
  "/",
  validateListing,
  isLoggedIn,
  wrapAsync(async (req, res, next) => {
    console.log(req.body); // Log the received form data to debug
    if (req.body.listing.image === "") {
      req.body.listing.image = undefined; // Handle empty string
    }
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
  })
);

//Edit Route
router.get(
  "/:id/edit",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing Does Not Exist");
      res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
  })
);

//Update Route
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  validateListing,
  wrapAsync(async (req, res) => {
    const { id } = req.params;
    let updatedListing = req.body.listing;

    if (typeof updatedListing.image === "string") {
      try {
        updatedListing.image = JSON.parse(updatedListing.image);
      } catch (error) {
        console.error("Failed to parse image field:", error);
      }
    }

    await Listing.findByIdAndUpdate(id, updatedListing);
    req.flash("success", "Listing Updated!");
    res.redirect(`/listings/${id}`);
  })
);

//Delete Route
router.delete(
  "/:id",
  isLoggedIn,
  wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
  })
);

module.exports = router;
