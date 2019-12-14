const db = require("../models");
const _ = require("lodash");
const DbErrors = require("../errors/database");
const { CustomError, CustomInternalError } = require("../errors");
const PokemonService = require("./pokemon");

module.exports = {
    // Inserts a Team into database
    insert: async function(team) {
        let insertedTeam = await db.teams.create(team);
        insertedTeam.dataValues.pokemon_ids = insertedTeam.get("pokemon_ids");

        return insertedTeam;
    },
    // Gets a Team from database by an id. Also gets fetch pokémon data from pokeapi micro-service
    get: async function(id) {
        let team = await db.teams.findOne({ where: { id } }).catch(err => {
            throw new CustomInternalError(err);
        });

        if (team == null) throw new CustomError(DbErrors.DB002);

        let pokemonIds = team.get("pokemon_ids");

        // fetching pokémon data
        let pokemonsResponse = await PokemonService.getPokemonsByIds(pokemonIds);
        let pokemons = pokemonsResponse.pokemons;
        team.dataValues.pokemons = pokemons;

        return team;
    },
    // Deletes a Team from database
    delete: async function(id) {
        let team = await db.teams.destroy({ where: { id } }).catch(err => {
            throw new CustomInternalError(err);
        });

        if (team == 0) throw new CustomError(DbErrors.DB002);
    }
};
