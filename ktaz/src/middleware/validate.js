const Joi = require('joi');

const productSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().allow('', null),
    category: Joi.string().required(),
    price: Joi.number().positive().required(),
    stock: Joi.number().integer().min(0).default(0),
    imageUrl: Joi.string().uri().allow('', null),
    // Добавлено поле image для валидации загрузки файла, если оно передается в body
    image: Joi.any() 
});

const validateProduct = (req, res, next) => {
    const { error } = productSchema.validate(req.body, { abortEarly: false });
    
    if (error) {
        return res.status(400).json({
            error: 'Validation Error',
            details: error.details.map(d => d.message)
        });
    }
    
    next();
};

module.exports = { validateProduct };