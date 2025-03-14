const mongoose = require('mongoose');

const cities = require('./cities');
const { descriptors, places } = require('./seedHelpers');

const Business = require('../models/businesses');



main().catch(err => console.log(err));
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/business');
}

const sample = array => array[Math.floor(Math.random() * array.length)];


const seedDB = async () => {
    await Business.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random = Math.floor(Math.random() * cities.length);
        const price = Math.floor(Math.random() * 50) + 50
        const business = new Business({
            author: '67c52f0cd178ef7ef49c22b0',
            city: cities[random].city,
            state: cities[random].state,
            title: `${sample(descriptors)} ${sample(places)}`,
            // images: `https://picsum.photos/400?random=${Math.random()}`,
            images: [
                {
                    url: 'https://res.cloudinary.com/dq2to8sns/image/upload/v1741983809/CityScout/wjgz1ljtp7gdljsnuath.jpg',
                    filename: 'CityScout/wjgz1ljtp7gdljsnuath'
                },
                {
                    url: 'https://res.cloudinary.com/dq2to8sns/image/upload/v1741983808/CityScout/rccnckr1idrvtjserct4.jpg',
                    filename: 'CityScout/rccnckr1idrvtjserct4'
                }
            ],
            description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, atque.',
            price
        });
        await business.save();
        console.log(business);
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})