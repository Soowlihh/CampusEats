
const mongoose = require('mongoose');
const spots = require('./spots')
const {places, descriptors} = require('./seedHelpers');
const Campuseats = require('../models/campuseats');

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

const sample = array => array[Math.floor(Math.random() * array.length)];
const seedDB = async () => {
    await Campuseats.deleteMany({});
   for (let i = 0; i < 10; i++){
    const random10 = Math.floor(Math.random() * 10);
    const camp = new Campuseats({
        location: `${spots[random10].name}, ${spots[random10].address}`,
        title: `${sample(descriptors)} ${sample(places)}`
    })
    await camp.save();
   }
}

seedDB().then(()=> {
    mongoose.connection.close();
})
