const express = require('express');
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listings.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingsController = require("../controllers/listing.js");

const multer = require("multer");
const {storage} = require("../cloudConfig.js"); // Assuming you have a cloudConfig.js file for cloudinary storage
const upload = multer({ storage });
//router.get("/", wrapAsync(listingsController.index)); // ✅ Correct name

router.route("/")
.get(wrapAsync(listingsController.index))
.post(isLoggedIn, upload.single('listing[image]'), validateListing, wrapAsync(listingsController.createListing)
    
);

//New Route
router.get("/new", isLoggedIn, listingsController.renderNewForm);


router.route("/:id")
.get(wrapAsync(listingsController.showListing))
.put(isLoggedIn, isOwner,upload.single('listing[image]'), validateListing, wrapAsync(listingsController.updateListing))
.delete(isLoggedIn, isOwner, wrapAsync(listingsController.destroyListing)
);







//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingsController.renderEditForm));

module.exports = router;