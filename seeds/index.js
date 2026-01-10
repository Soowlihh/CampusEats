
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
    const price = Math.floor(Math.random() * 20) + 10;
    const camp = new Campuseats({
        location: `${spots[random10].name}, ${spots[random10].address}`,
        title: `${sample(descriptors)} ${sample(places)}`,
        image: `https://picsum.photos/400?random=${Math.random()}`,
        description: 'Step into Halal Spot, where every dish is prepared with care, using only 100% Halal-certified ingredients. From sizzling grills to savory specialties, our menu brings authentic flavors from around the world right to your plate. Whether you’re grabbing a quick bite, enjoying a hearty meal with friends, or craving comfort food, Halal Spot promises fresh, flavorful, and wholesome meals that satisfy both your taste buds and your values.',
        price
    })
    await camp.save();
   }
}

seedDB().then(()=> {
    mongoose.connection.close();
})
