/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const { wrapAsync } = require("../utils/wrappers");
const { PokemonService } = require("../services");
const { Pokemon } = require("../schemas");
const _ = require("lodash");

// Route for get pokémons, supporting filtering by name and type.
router.get(
    "/",
    wrapAsync(
        async (req, res, next) => {
            let pokemons = await PokemonService.getPokemons(req.query.name, req.query.type);
            return res.json(pokemons);
        },
        undefined,
        Pokemon.getPokemonQuerySchema
    )
);

module.exports = router;
