const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync");
const { createReview, destroyReview } = require("../controllers/reviews");
const { isLoggedIn, validateReview, isReviewAuthor } = require("../middleware");

// Reviews Route
// Post Route
router.post("/", isLoggedIn, validateReview, wrapAsync(createReview));

// Review Delete Route
router.delete(
  "/:reviewId",
  isLoggedIn,
  isReviewAuthor,
  wrapAsync(destroyReview)
);

module.exports = router;
