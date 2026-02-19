const {campuseatSchema, reviewSchema} = require('./schema.js');
const expressError = require('./utilities/expressError');
const Campuseats = require('./models/campuseats');


module.exports.isLoggedIn = (req,res,next) => {
    if(!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl
        req.flash('error', 'You must be logged in');
        return res.redirect('/login');
    }
    next();
}

module.exports.validateCampuseat = (req, res, next) => {
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

  module.exports.isOwner = async(req,rres,next) => {
    const campuseats = await Campuseats.findById(id);
    if(!campuseats.owner || !campuseats.owner.equals(req.user._id)){
      req.flash('error', 'you do not have permission to do that');
      return res.redirect(`/campuseats/${id}`);
    }
    next();
  }
  
  module.exports.validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
    return res.status(400).render('/reviews', {
        campuseats: req.body.campuseats || {}
      });
}