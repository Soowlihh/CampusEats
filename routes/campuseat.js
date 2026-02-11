const express = require('express');
const router = express.Router();
const catchAsync = require('../utilities/catchAsync');
const {campuseatSchema} = require('../schema.js');
const expressError = require('../utilities/expressError');
const Campuseats = require('../models/campuseats');


const validateCampuseat = (req, res, next) => {

    const {error} = campuseatSchema.validate(req.body, { abortEarly: false });

    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
}

router.get('/', async (req, res) => {
    const campuseats = await Campuseats.find({});
    console.log(campuseats);
    res.render('campuseats/index', {campuseats})
})
router.get('/new', (req, res) => {

    // const campuseats = await Campuseats.findById(req.params.id)
     res.render('campuseats/new');
 })
 router.post('/', validateCampuseat, catchAsync(async (req, res, next) => {
    
   // if(!req.body.campuseat) throw new expressError('Invalid Data' , 400)
    const campuseat = new Campuseats(req.body.campuseats);
    await campuseat.save();
    req.flash('success', 'Succesfully made a new Spot!')
    res.redirect(`/campuseats/${campuseat._id}`)
 }))
 
router.get('/:id', async(req, res) => {
    const campuseats = await Campuseats.findById(req.params.id).populate('reviews');
    if(!campuseat){
        req.flash('error', 'Cannot find that Spot!');
        return res.redirect('/campuseats');
    }
    res.render('campuseats/show', {campuseats});
})
router.get('/:id/edit', catchAsync( async(req, res) => {
    const campuseats = await Campuseats.findById(req.params.id);
    if(!campuseat){
        req.flash('error', 'Cannot find that Spot!');
        return res.redirect('/campuseats');
    }
    res.render('campuseats/edit', {campuseats});
}))
router.put('/:id', validateCampuseat, catchAsync( async (req, res) => {
    //res.send("Worked!!!")
    const{id} = req.params;
    const campuseats = await Campuseats.findByIdAndUpdate(id,{...req.body.campuseats});
    req.flash('success', ' Succesfully updated Spot!')
    res.redirect(`/campuseats/${campuseat._id}`)
}))
router.delete('/:id', catchAsync( async (req, res) =>{
    const {id} = req.params;
    await Campuseats.findByIdAndDelete(id);
    req.flash('success', ' Succesfully Deleted Spot!')
    res.redirect('/campuseats');
}));

module.exports = router;