module.exports = function(sequelize, Sequelize) {
    const Team = sequelize.define("teams", {
        id: {
            primaryKey: true,
            type: Sequelize.INTEGER,
            autoIncrement: true
        },
        name: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        trainer_name: {
            type: Sequelize.STRING,
            notEmpty: true
        },
        pokemon_ids: {
            type: Sequelize.STRING,
            notEmpty: true,

            get() {
                let ids = JSON.parse(this.getDataValue("pokemon_ids"));
                return ids;
            },
            set(ids) {
                let stringIds = JSON.stringify(ids);
                this.setDataValue("pokemon_ids", stringIds);
            }
        }
    });

    return Team;
};
