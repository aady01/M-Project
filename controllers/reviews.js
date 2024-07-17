const Review = require("../models/review");
const Listing = require("../models/listing");

module.exports.createReview = async (req, res) => {
  try {
    const listingId = req.params.id;
    console.log("Listing ID:", listingId);
    if (!listingId) {
      req.flash("error", "Invalid listing ID");
      return res.redirect("/listings");
    }

    let listing = await Listing.findById(listingId);
    console.log("Listing found:", listing);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews = listing.reviews || []; // Ensure reviews is an array
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();

    req.flash("success", "New Review Created!");
    res.redirect(`/listings/${listing._id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/listings");
  }
};

module.exports.destroyReview = async (req, res) => {
  try {
    const { id, reviewId } = req.params;
    if (!id || !reviewId) {
      req.flash("error", "Invalid IDs");
      return res.redirect("/listings");
    }

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/listings");
  }
};
