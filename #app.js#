const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utilities/catchAsync');
const {campuseatSchema, reviewSchema} = require('./schema.js');
const expressError = require('./utilities/expressError');
const methodOverride = require('method-override');
const Campuseats = require('./models/campuseats');
const Review = require('./models/review');

mongoose.connect('mongodb://localhost:27017/campus', {
   // useNewUrlParser: true,
   // useCreateIndex: true,
   // useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

 
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));

const validateCampuseat = (req, res, next) => {

    const {error} = campuseatSchema.validate(req.body, { abortEarly: false });

    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    const {error} = reviewSchema.validate(req.body);
    if(error){
        const msg = error.details.map(el => el.message).join(',')
        throw new expressError(msg, 400)
    } else {
        next();
    }
}
app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
  });
app.get('/', (req, res) => {
    res.redirect('/campuseats');
  });
//app.get('/', (req, res) => {
 //   res.render('home')
//})
app.get('/campuseats', async (req, res) => {
    const campuseats = await Campuseats.find({});
    console.log(campuseats);
    res.render('campuseats/index', {campuseats})
})
app.get('/campuseats/new', (req, res) => {

    // const campuseats = await Campuseats.findById(req.params.id)
     res.render('campuseats/new');
 })
 app.post('/campuseats', validateCampuseat, catchAsync(async (req, res, next) => {
   // if(!req.body.campuseat) throw new expressError('Invalid Data' , 400)
    const campuseat = new Campuseats(req.body.campuseats);
    await campuseat.save();
    res.redirect(`/campuseats/${campuseat._id}`)
 }))
 
app.get('/campuseats/:id', async(req, res) => {
    const campuseats = await Campuseats.findById(req.params.id).populate('reviews');
    res.render('campuseats/show', {campuseats});
})
app.get('/campuseats/:id/edit', catchAsync( async(req, res) => {
    const campuseats = await Campuseats.findById(req.params.id)
    res.render('campuseats/edit', {campuseats});
}))
app.put('/campuseats/:id', validateCampuseat, catchAsync( async (req, res) => {
    //res.send("Worked!!!")
    const{id} = req.params;
    const campuseat = await Campuseats.findByIdAndUpdate(id,{...req.body.campuseats});
    res.redirect(`/campuseats/${campuseat._id}`)
}))
app.delete('/campuseats/:id', catchAsync( async (req, res) =>{
    const {id} = req.params;
    await Campuseats.findByIdAndDelete(id);
    res.redirect('/campuseats');
}))

app.post('/campuseats/:id/reviews', validateReview, catchAsync(async(req, res) => {
const campuseat = await Campuseats.findById(req.params.id);
const review = new Review(req.body.review);
campuseat.reviews.push(review);
await review.save(); 
await campuseat.save();
res.redirect(`/campuseats/${campuseat._id}`);
}))

app.delete('/campuseats/:id/reviews/:reviewId' , catchAsync (async (req, res) => {
    const { id, reviewId } = req.params;
    await Campuseats.findByIdAndUpdate(id, {$pull : { reviews: reviewId} });
    await Review.findByIdAndDelete(req.params.reviewId);
    res.redirect(`/campuseats/${id}`);
}))

app.all(/(.*)/, (req,  res, next) => {
    next(new expressError('Page Not Found' , 404))
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if(!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('ERROR', {err})
})

app.listen(4000, () => {
    console.log('Serving on port 3000')
}) 