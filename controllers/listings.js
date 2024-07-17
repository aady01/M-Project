const Listing = require("../models/listing");

module.exports.index = async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index", { allListings });
};

module.exports.renderNewForm = (req, res) => {
  res.render("listings/new");
};

module.exports.showListing = async (req, res) => {
  try {
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
    res.render("listings/show", { listing, currUser: req.user });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/listings");
  }
};

module.exports.createListing = async (req, res, next) => {
  console.log(req.body); // Log the received form data to debug
  if (req.body.listing.image === "") {
    req.body.listing.image = undefined; // Handle empty string
  }
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New Listing Created!");
  res.redirect("/listings");
};

module.exports.renderEditForm = async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  if (!listing) {
    req.flash("error", "Listing Does Not Exist");
    res.redirect("/listings");
  }
  res.render("listings/edit", { listing });
};

module.exports.updateListing = async (req, res) => {
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
};

module.exports.destroyListing = async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  req.flash("success", "Listing Deleted!");
  res.redirect("/listings");
};
