// CLS is used to share transaction object between queries.
// reference: https://sequelize.org/v4/manual/tutorial/transactions.html
const cls = require("continuation-local-storage");
let namespace = cls.createNamespace("sequelize-namespace");
const Sequelize = require("sequelize");
Sequelize.useCLS(namespace);

const db = {};

function customLogging() {}

const config = {
    dialect: "sqlite",
    storage: "./db/database.sqlite",
    define: {
        freezeTableName: true
    },
    logging: customLogging
};

const sequelize = new Sequelize(process.env.DATABASE_NAME, "", "", config);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
