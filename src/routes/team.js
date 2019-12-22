/* eslint-disable new-cap */
const express = require("express");
const router = express.Router();
const { wrapAsync } = require("../utils/wrappers");
const { PokemonService, TeamService } = require("../services");
const { Team } = require("../schemas");
const _ = require("lodash");
//const Errors = require("../errors/index");
const httpCodes = require("../utils/http-status");

function hasDuplicates(a) {
    return _.uniq(a).length !== a.length;
}

// Route to create a Team
router.post(
    "/",
    wrapAsync(async (req, res, next) => {
        let team = req.body;

        team = await TeamService.insert(team);
        team = team.dataValues;

        return res.json({ team });
    }, Team.createTeamSchema)
);

// Route to get a Team by Id
router.get(
    "/",
    wrapAsync(
        async (req, res, next) => {
            let id = req.query.id;

            let team = await TeamService.get(id);
            team = team.dataValues;

            // the TeamService.get build a pokemon array inside team.dataValues, so we can remove "pokemon_ids" integer array.
            team = _.omit(team, "pokemon_ids");
            return res.json({ team });
        },
        undefined,
        Team.getTeamSchema
    )
);

// Route to delete a Team by id
router.delete(
    "/",
    wrapAsync(
        async (req, res, next) => {
            let id = req.query.id;

            await TeamService.delete(id);

            return res.json("The Team was deleted successfully.");
        },
        undefined,
        Team.deleteTeamSchema
    )
);

module.exports = router;
