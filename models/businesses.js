const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./reviews');

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('cardImage').get(function () {
    return this.url.replace('/upload', '/upload/ar_4:3,c_crop')
})

ImageSchema.virtual('indexImage').get(function () {
    return this.url.replace('/upload', '/upload/w_350,h_250,c_fill')
})

const businessSchema = new Schema({
    title: String, // Business name
    description: String,  // Short description
    city: String,  // City name
    state: String,  // State/Province
    images: [ImageSchema],  // Array of images
    geometry: {  // GeoJSON
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,  // Average price
    author: {
        type: Schema.Types.ObjectId, //object id
        ref: 'User' // from the user model
    },
    reviews: [
        {
            type: Schema.Types.ObjectId, //object id
            ref: 'Review' // from the review model
        }
    ]
    // category: String,  // E.g., Restaurant, Gym, Salon
    // address: String,  // Street address
    // zipCode: String,  // Postal code
    // country: String,  // Country
    // phone: String,  // Contact number
    // website: String,  // Business website URL
    // email: String,  // Business email
})

businessSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        await Review.deleteMany({
            _id: {
                $in: doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Business', businessSchema);

