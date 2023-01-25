import { Container, CosmosClient, Database } from '@azure/cosmos';
import { waitForDebugger } from 'inspector';

const COSMOS_DB_RESOURCE_NAME = 'byrsouthCosmos';
const COSMOS_DB_RESOURCE_KEY =
   'SkAD8ssgZXS20I1et846YnRjt468HEAT4DAqJDZkE8KUldhr4NDCin88Syf6BQju5WAbuAqk0kSiACDbtRY4QA==';

let db: Database;
let container: Container;
let client: CosmosClient | undefined;

const config = {
   COSMOSDB_SQL_API_URI: `https://${COSMOS_DB_RESOURCE_NAME}.documents.azure.com:443/`,
   COSMOSDB_SQL_API_KEY: COSMOS_DB_RESOURCE_KEY,
   COSMOSDB_SQL_API_DATABASE_NAME: 'byrsouthdb',
   COSMOSDB_SQL_API_CONTAINER_NAME: 'deployments',
};

const connect = () => {
   try {
      const connectToCosmosDB = {
         endpoint: config.COSMOSDB_SQL_API_URI,
         key: config.COSMOSDB_SQL_API_KEY,
      };

      return new CosmosClient(connectToCosmosDB);
   } catch (err) {
      console.log("Azure Cosmos DB - can't connect - err");
      console.log(err);
   }
};

const connectToDatabase = async () => {
   client = connect();
   if (client) {
      // get DB
      const databaseResult = await client.databases.createIfNotExists({
         id: config.COSMOSDB_SQL_API_DATABASE_NAME,
      });
      db = databaseResult.database;

      if (db) {
         // get Container
         const containerResult = await db.containers.createIfNotExists({
            id: config.COSMOSDB_SQL_API_CONTAINER_NAME,
         });
         container = containerResult.container;
         return !!db;
      }
   } else {
      throw new Error("can't connect to database");
   }
};

export async function find(...params: string[]) {
   const database = await connectToDatabase();
   if (!database) throw Error('db not working');
   console.log(
      'connected to ' +
         config.COSMOSDB_SQL_API_DATABASE_NAME +
         '/' +
         config.COSMOSDB_SQL_API_CONTAINER_NAME
   );

   let query = params[0];
   console.log(`query = ${query}`);
   if (query == null) {
      query = 'SELECT * from c';
   } else {
      query = `SELECT * from c where c.id = ${query}`;
   }

   const result = await container.items.query(query).fetchAll();
   waitForDebugger;
   return result && result.resources ? result.resources : [];
}
