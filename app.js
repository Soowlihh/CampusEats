const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const catchAsync = require('./utilities/catchAsync');
const expressError = require('./utilities/expressError');
const methodOverride = require('method-override');
const Campuseats = require('./models/campuseats');

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
const app = express();
 
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({extended : true}));
app.use(methodOverride('_method'));

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
 app.post('/campuseats', catchAsync(async (req, res, next) => {
    if(!req.body.campuseat) throw new expressError('Invalid Data' , 400)
    const campuseat = new Campuseats(req.body.campuseats);
    await campuseat.save();
    res.redirect(`/campuseats/${campuseat._id}`)
 }))
 
app.get('/campuseats/:id', async(req, res) => {
    const campuseats = await Campuseats.findById(req.params.id)
    res.render('campuseats/show', {campuseats});
})
app.get('/campuseats/:id/edit', catchAsync( async(req, res) => {
    const campuseats = await Campuseats.findById(req.params.id)
    res.render('campuseats/edit', {campuseats});
}))
app.put('/campuseats/:id', catchAsync( async (req, res) => {
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