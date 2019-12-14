const Joi = require("@hapi/joi");

module.exports.createTeamSchema = Joi.object({
    name: Joi.string().required(),
    trainer_name: Joi.string().required(),
    pokemon_ids: Joi.array() // This grants that pokemon_ids must have 6 ids exactly, and all ids must be numbers.
        .length(6)
        .items(Joi.number().integer())
        .required()
        .strict()
});

module.exports.getTeamSchema = Joi.object({
    id: Joi.number().required()
});

module.exports.deleteTeamSchema = Joi.object({
    id: Joi.number().required()
});
