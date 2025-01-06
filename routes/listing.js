// DESTRUCTURING THE LISTINGS

const express = require("express");
const router = express.Router({mergeParams: true});
const WrapAsync = require("../utils/WrapAsync.js");
const Listing = require("../model/listing.js");
const {isLoggedIn, isOwner, validateListing, validateUUID} = require("../middlewares.js");





router.get("/", WrapAsync(async (req, res) => {
    let allListings = await Listing.find();
    res.render("listings/listings.ejs", {allListings});
}))

router.get("/new",
    isLoggedIn,
    WrapAsync(async (req, res) => {
        res.render("listings/create.ejs");
}))

router.get("/:id",
    validateUUID,
    WrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id)
    .populate({
        path: "reviews",
        populate: {
            path: "author",
        },
    })
    .populate("owner");


    if(!listing) {
        req.flash("error", "Listing you requested does not exist!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}))

router.post(
    "/",
    isLoggedIn,
    validateListing,
    WrapAsync(async (req, res, next) => {
    let listing = req.body.listing;
    let newListing = new Listing(listing);
    newListing.owner = req.user._id;
    await newListing.save();

    req.flash("success", "New Listing Created!");
    res.redirect("/listings");
}))

router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    WrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing) {
        req.flash("error", "Listing you requested does not exist!");
    }
    res.render("listings/edit.ejs", {listing});
}))

router.put(
    "/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    WrapAsync(async (req, res) => {
    let {id} = req.params;
    let listing = req.body.listing;
    await Listing.findByIdAndUpdate(id, listing);

    req.flash("success", "New Listing Updated!");
    res.redirect(`/listings/${id}`);
}))

router.delete("/:id",
    isLoggedIn,
    isOwner,
    validateUUID,
    WrapAsync(async (req, res) => {
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    
    req.flash("success", "Listing Deleted!");
    res.redirect("/listings");
}))


module.exports = router;