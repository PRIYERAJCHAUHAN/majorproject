const express = require('express');
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const Review = require("../models/review.js");
const Listing = require("../models/listings.js");
const {validateReview, isLoggedIn, isReviewAuthor} = require("../middleware.js");

const reviewController = require("../controllers/reviews.js");



//Post Review Route
router.post("/",isLoggedIn, validateReview, wrapAsync(reviewController.createReview)); 


    //Delete Review Route
    // router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(async(req, res) => {
    //     let {id, reviewId} = req.params;
    //     await Listing.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    //     await Review.findByIdAndDelete(reviewId);
    //         req.flash("success", "Review Deleted Deleted");

    //     res.redirect(`/listings/${id}`);
    // }));
// routes/review.js
router.delete("/:reviewId", isLoggedIn, isReviewAuthor, wrapAsync(reviewController.destroyReview));



    module.exports = router;