// DESTRUCTURING THE REVIEWS

const express = require("express");
const router = express.Router({mergeParams: true});
const WrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../model/listing.js");
const Review = require("../model/review.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middlewares.js");





router.post("/",
    isLoggedIn,
    validateReview,
    WrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    res.redirect(`/listings/${req.params.id}`);
}))

router.delete("/:reviewId",
    isLoggedIn,
    isReviewAuthor,
    async(req, res) => {
    let {id, reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    
    req.flash("success", "Review Deleted!");
    res.redirect(`/listings/${id}`);
})

module.exports = router;