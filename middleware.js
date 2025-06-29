const ExpressError = require("./utils/ExpressError.js");
const {listingSchema, reviewSchema} = require("./schema.js");
const Listing = require("./models/listings");
const Review = require("./models/review.js");


module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("error", "You must be signed in to do that!");
        return res.redirect("/login");
    }
    next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
};

// module.exports.isOwner = async(req, res, next) => {
//     let { id } = req.params; // ✅ Destructure to get plain ID string
//     let listing = await Listing.findById(id);
//     if(!listing.owner.equals(res.locals.currUser._id)){
//         req.flash("error", "You are not the owner of this listing");
//         return res.redirect(`/listings/${id}`);
//     }
//     next();
// };
module.exports.isOwner = async (req, res, next) => {
    const { id } = req.params;
    if (!id) {
        req.flash("error", "Invalid request. ID missing.");
        return res.redirect("/listings");
    }

    const listing = await Listing.findById(id);
    if (!listing) {
        req.flash("error", "Listing not found!");
        return res.redirect("/listings");
    }

    if (!listing.owner || !res.locals.currUser) {
        req.flash("error", "Something went wrong. Try again.");
        return res.redirect(`/listings/${id}`);
    }

    if (!listing.owner.equals(res.locals.currUser._id)) {
        req.flash("error", "You are not the owner of this listing");
        return res.redirect(`/listings/${id}`);
    }

    next();
};



module.exports.validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    } else { 
        next();
    }
};

module.exports.validateReview = (req, res, next) => {
  let { error } = reviewSchema.validate(req.body);
  if (error) {
    let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400, error);
    } else { 
        next();
    }
};

// module.exports.isReviewAuthor = async(req, res, next) => {
//     let {  reviewId } = req.params; // ✅ Destructure to get plain ID string
//     let review = await Review.findById(reviewId);
//     //if(!review.author.equals(res.locals.currUser._id)){
//     if (!review.author.equals(req.user._id)) {

//         req.flash("error", "You are not the author of this review");
//         return res.redirect(`/listings/${id}`);
//     }
//     next();
// };
module.exports.isReviewAuthor = async (req, res, next) => {
    const { reviewId } = req.params;
    const review = await Review.findById(reviewId);

    if (!review) {
        req.flash("error", "Review not found.");
        return res.redirect("back");
    }

    if (!review.author.equals(req.user._id)) {
        req.flash("error", "You are not the author of this review.");
        return res.redirect("back");
    }

    next();
};