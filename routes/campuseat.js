const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const passport = require('passport');
const catchAsync = require('../utilities/catchAsync');
const {campuseatSchema} = require('../schema.js');
const {isLoggedIn} = require('../middleware');

const expressError = require('../utilities/expressError');
const Campuseats = require('../models/campuseats');


/*const validateCampuseat = (req, res, next) => {

    const {error} = campuseatSchema.validate(req.body, { abortEarly: false });

    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
}*/
const validateCampuseat = (req, res, next) => {
    const { error } = campuseatSchema.validate(req.body, {
      abortEarly: false,
      convert: true
    });
  
    if (error) {
      const msg = error.details.map(el => el.message).join(', ');
      req.flash('error', msg);
  
      // stay on the SAME page (new form) instead of going to ERROR.ejs
      return res.status(400).render('campuseats/new', {
        campuseats: req.body.campuseats || {}
      });
    }
  
    next();
  };
  

router.get('/', async (req, res) => {
    const campuseats = await Campuseats.find({});
    console.log(campuseats);
    res.render('campuseats/index', {campuseats})
})
router.get('/new', (req, res) => {
    if(!req.isAuthenticated()) {
        req.flash('error', 'You must be signed in');
        return res.redirect('/login');
    }
    // const campuseats = await Campuseats.findById(req.params.id)
     res.render('campuseats/new');
 })
 router.post('/', isLoggedIn, validateCampuseat, catchAsync(async (req, res, next) => {
    
   // if(!req.body.campuseat) throw new expressError('Invalid Data' , 400)
    const campuseat = new Campuseats(req.body.campuseats);
    await campuseat.save();
    req.flash('success', 'Succesfully made a new Spot!')
    res.redirect(`/campuseats/${campuseat._id}`)
 }))
 
/*router.get('/:id', async(req, res) => {
    const campuseats = await Campuseats.findById(req.params.id).populate('reviews');
    if(!campuseats){
        req.flash('error', 'Cannot find that Spot!');
        return res.redirect('/campuseats');
    }
    res.render('campuseats/show', {campuseats});
})*/
router.get('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
  
    // ✅ prevents CastError for /campuseats/register
    if (!mongoose.Types.ObjectId.isValid(id)) {
      req.flash('error', 'Invalid Campuseats ID.');
      return res.redirect('/campuseats');
    }
  
    const campuseats = await Campuseats.findById(id).populate('reviews');
    if (!campuseats) {
      req.flash('error', 'Cannot find that Spot!');
      return res.redirect('/campuseats');
    }
  
    res.render('campuseats/show', { campuseats });
  }));
  
router.get('/:id/edit', isLoggedIn, catchAsync( async(req, res) => {
    const campuseats = await Campuseats.findById(req.params.id);
    if(!campuseats){
        req.flash('error', 'Cannot find that Spot!');
        return res.redirect('/campuseats');
    }
    res.render('campuseats/edit', {campuseats});
}))
router.put('/:id', isLoggedIn, validateCampuseat, catchAsync( async (req, res) => {
    //res.send("Worked!!!")
    const{id} = req.params;
    const campuseats = await Campuseats.findByIdAndUpdate(id,{...req.body.campuseats});
    req.flash('success', ' Succesfully updated Spot!')
    res.redirect(`/campuseats/${campuseats._id}`)
}))
router.delete('/:id', isLoggedIn, catchAsync( async (req, res) =>{
    const {id} = req.params;
    await Campuseats.findByIdAndDelete(id);
    req.flash('success', ' Succesfully Deleted Spot!')
    res.redirect('/campuseats');
}));

module.exports = router;