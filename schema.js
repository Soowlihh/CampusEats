const Joi = require('joi');


module.exports.campuseatSchema  = Joi.object({
    campuseats: Joi.object().required({
        title: Joi.string().required().messages({"string.base" : "title must not be empty"}),
        price: Joi.number().required().min(0),
        image: Joi.string().required(), 
        location: Joi.string().required(),
        description: Joi.string().required(),
    }).required()
})
module.exports.reviewSchema = Joi.object({
review: Joi.object({
    rating: Joi.number().required(),
    body: Joi.string().required()
}).required()
})

 