const Joi = require("@hapi/joi");

module.exports.getPokemonQuerySchema = Joi.object({
    name: Joi.string(),
    type: Joi.string()
});
