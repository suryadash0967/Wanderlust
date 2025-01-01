// DESTRUCTURING THE LISTINGS

const express = require("express");
const router = express.Router({mergeParams: true});
const WrapAsync = require("../utils/WrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const {listingSchema} = require("../schema.js");
const Listing = require("../model/listing.js");





const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map(el => el.message).join(","); // joins all error messages
        throw new ExpressError(400, errMsg);
    } else {
        next();
    }
}

const validateUUID = (req, res, next) => {
    const { id } = req.params;
    const uuidRegex = /^[0-9a-fA-F]{24}$/; // Adjust regex for MongoDB ObjectId if necessary
    if (!uuidRegex.test(id)) {
        return next(new ExpressError(404, "Page not found!"));
    }
    next();
};



router.get("/", WrapAsync(async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings.ejs", {allListings});
}))

router.get("/new", WrapAsync(async (req, res) => {
    res.render("create.ejs");
}))

router.get("/:id",
    validateUUID,
    WrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id).populate("reviews");
    if(!listing) {
        throw new ExpressError(404, "Page not found");
    }
    res.render("show.ejs", {listing});
}))

router.post("/",
    validateListing,
    WrapAsync(async (req, res, next) => {
    let listing = req.body.listing;
    let newListing = new Listing(listing);
    await newListing.save();
    res.redirect("/listings");
}))

router.get("/:id/edit", WrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("edit.ejs", {listing});
}))

router.put("/:id",
    validateListing,
    WrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = req.body.listing;
    await Listing.findByIdAndUpdate(id, listing);
    res.redirect(`/listings/${id}`);
}))

router.delete("/:id",
    validateUUID,
    WrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}))


module.exports = router;