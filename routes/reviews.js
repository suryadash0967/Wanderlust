// DESTRUCTURING THE REVIEWS

const express = require("express");
const router = express.Router({mergeParams: true});
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const { reviewSchema} = require("../schema.js");
const Listing = require("../model/listing.js");
const Review = require("../model/review.js");


const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map(el => el.message).join(","); // joins all error messages
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}



router.post("/",
    validateReview,
    WrapAsync(async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    console.log(req.body);
    let newReview = new Review(req.body.review);

    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();

    res.redirect(`/listings/${req.params.id}`);
}))

router.delete("/:reviewId", async(req, res) => {
    let {id, reviewId} = req.params;

    await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
})

module.exports = router;