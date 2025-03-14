const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

const businessSchema = new Schema({
    title: String, // Business name
    description: String,  // Short description
    // category: String,  // E.g., Restaurant, Gym, Salon
    // address: String,  // Street address
    city: String,  // City name
    state: String,  // State/Province
    // zipCode: String,  // Postal code
    // country: String,  // Country
    // phone: String,  // Contact number
    // website: String,  // Business website URL
    // email: String,  // Business email
    images: [ImageSchema],  // Array of images
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

