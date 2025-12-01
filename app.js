const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const Campuseats = require('./models/campuseats');

mongoose.connect('mongodb://localhost:27017/campus', {
    useNewUrlParser: true,
   // useCreateIndex: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});
const app = express();
 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))
app.use(express.urlencoded({extended : true}))
app.use(methodOverride('_method'));

 

app.get('/', (req, res) => {
    res.render('home')
})
app.get('/campuseats', async (req, res) => {
    const campuseats = await Campuseats.find({});
    console.log(campuseats);
    res.render('campuseats/index', {campuseats})
})
app.get('/campuseats/new', (req, res) => {
    // const campuseats = await Campuseats.findById(req.params.id)
     res.render('campuseats/new');
 })
 app.post('/campuseats', async (req, res) => {
    const campuseat = new Campuseats(req.body.campuseats);
    await campuseat.save();
    res.redirect(`/campuseats/${campuseat._id}`)
 })
 
app.get('/campuseats/:id', async(req, res) => {
    const campuseats = await Campuseats.findById(req.params.id)
    res.render('campuseats/show', {campuseats});
})
app.get('/campuseats/:id/edit', async(req, res) => {
    const campuseats = await Campuseats.findById(req.params.id)
    res.render('campuseats/edit', {campuseats});
})
app.put('/campuseats/:id', async (req, res) => {
    //res.send("Worked!!!")
    const{id} = req.params;
    const campuseats = await Campuseats.findByIdAndUpdate(id,{...req.body.campuseats});
    res.redirect(`/campuseats/${campuseats._id}`)
})
app.listen(3000, () => {
    console.log('Serving on port 3000')
}) 