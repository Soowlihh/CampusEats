const express = require('express');
const app = express();
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const expressError = require('./utilities/expressError');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user')

const userRoutes = require('./routes/user');
const campuseat = require('./routes/campuseat');
const reviews = require('./routes/reviews');



mongoose.connect('mongodb://localhost:27017/campus', {
   // useNewUrlParser: true,
   // useCreateIndex: true,
   // useUnifiedTopology: true
   // useFindAndModify : false
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


app.use((req, res, next) => {
    console.log(req.method, req.path);
    next();
  });
app.use(express.static(path.join(__dirname, 'public')))

const sessionConfig = {
    secret : 'Thisshouldbeabettersecret!',
    resave : false,
    saveUninitialized : true,
    cookie : {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/fakeUser', async (req,res) => {
    const user = new User({email: '', username: ''})
   const newUser = await User.register(user, '');
   res.send(newUser);
})

app.use('/', userRoutes)
app.use('/campuseats', campuseat)
app.use('/campuseats/:id/reviews', reviews)


app.get('/', (req, res) => {
    res.redirect('/campuseats');
  });


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