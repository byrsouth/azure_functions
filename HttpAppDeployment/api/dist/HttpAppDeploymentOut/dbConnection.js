"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.find = void 0;
const cosmos_1 = require("@azure/cosmos");
const inspector_1 = require("inspector");
const COSMOS_DB_RESOURCE_NAME = 'byrsouth-db';
const COSMOS_DB_RESOURCE_KEY = 'dAL41yw8cKY4S8JdPopD86e00rEk2Us0ihQYFwWiy4BT1V9f7nldpyu436kung7dGa4F0CnzK8rMACDbNIzvjA==';
let db;
let container;
let client;
const config = {
    COSMOSDB_SQL_API_URI: `https://${COSMOS_DB_RESOURCE_NAME}.documents.azure.com:443/`,
    COSMOSDB_SQL_API_KEY: COSMOS_DB_RESOURCE_KEY,
    COSMOSDB_SQL_API_DATABASE_NAME: 'AppDeployDB',
    COSMOSDB_SQL_API_CONTAINER_NAME: 'deployments',
};
const connect = () => {
    try {
        const connectToCosmosDB = {
            endpoint: config.COSMOSDB_SQL_API_URI,
            key: config.COSMOSDB_SQL_API_KEY,
        };
        return new cosmos_1.CosmosClient(connectToCosmosDB);
    }
    catch (err) {
        console.log("Azure Cosmos DB - can't connect - err");
        console.log(err);
    }
};
const connectToDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    client = connect();
    if (client) {
        // get DB
        const databaseResult = yield client.databases.createIfNotExists({
            id: config.COSMOSDB_SQL_API_DATABASE_NAME,
        });
        db = databaseResult.database;
        if (db) {
            // get Container
            const containerResult = yield db.containers.createIfNotExists({
                id: config.COSMOSDB_SQL_API_CONTAINER_NAME,
            });
            container = containerResult.container;
            return !!db;
        }
    }
    else {
        throw new Error("can't connect to database");
    }
});
function find(...params) {
    return __awaiter(this, void 0, void 0, function* () {
        const database = yield connectToDatabase();
        if (!database)
            throw Error('db not working');
        console.log('connected to ' +
            config.COSMOSDB_SQL_API_DATABASE_NAME +
            '/' +
            config.COSMOSDB_SQL_API_CONTAINER_NAME);
        let query = params[0];
        console.log(`query = ${query}`);
        if (query == null) {
            query = 'SELECT * from c';
        }
        else {
            query = `SELECT * from c where c.id = ${query}`;
        }
        const result = yield container.items.query(query).fetchAll();
        inspector_1.waitForDebugger;
        return result && result.resources ? result.resources : [];
    });
}
exports.find = find;
//# sourceMappingURL=dbConnection.js.map