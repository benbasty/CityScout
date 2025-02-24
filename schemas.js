const Joi = require('joi');
module.exports.businessSchema = Joi.object({
        business: Joi.object({
            title: Joi.string().required(),
            price: Joi.number().required().min(0).greater(0),
            image: Joi.string().uri().required(),
            city: Joi.string().required(),
            state: Joi.string().required(),
            description: Joi.string().required()
        }).required()
})

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required()
}).required()
})