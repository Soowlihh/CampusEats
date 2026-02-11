const express = require('express')
const router = express.Router({mergeParams : true});
const Campuseats = require('../models/campuseats');
const Review = require('../models/review');
const catchAsync = require('../utilities/catchAsync');
const expressError = require('../utilities/expressError');
const {reviewSchema} = require('../schema.js');


const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async(req, res) => {
    const campuseat = await Campuseats.findById(req.params.id);
    const review = new Review(req.body.review);
    campuseat.reviews.push(review);
    await review.save(); 
    await campuseat.save();
    req.flash('success', ' Created new Review!')
    res.redirect(`/campuseats/${campuseat._id}`);
    }))
    
router.delete('/:reviewId' , catchAsync (async (req, res) => {
        const { id, reviewId } = req.params;
        await Campuseats.findByIdAndUpdate(id, {$pull : { reviews: reviewId} });
        await Review.findByIdAndDelete(req.params.reviewId);
        req.flash('success', ' Succesfully Deleted Review!')
        res.redirect(`/campuseats/${id}`);
}))

module.exports = router;