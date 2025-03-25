const mongoose = require('mongoose');

const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

const Business = require('../models/businesses');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});



main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/business');
}

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Business.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 50) + 50;
        const { resources } = await cloudinary.search
        .expression('folder:CityScout')
        .execute();
        const randomIndex = Math.floor(Math.random() * resources.length);
        const randomImage = resources[randomIndex];
        const randomImageUrl = randomImage.secure_url;
        const randomImageId = randomImage.public_id;

        const business = new Business({
            author: '67c52f0cd178ef7ef49c22b0',
            city: cities[random].city,
            state: cities[random].state,
            title: `${sample(descriptors)} ${sample(places)}`,
            images: [
                {
                    url: randomImageUrl,
                    filename: randomImageId
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, atque.',
            price,
            geometry: {
                type: 'Point',
                coordinates: [
                    cities[random].longitude,
                    cities[random].latitude
                ]
            }
        });
        await business.save();
        console.log(business);
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})