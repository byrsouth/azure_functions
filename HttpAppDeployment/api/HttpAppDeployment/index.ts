import { CosmosClient,SqlQuerySpec, SqlParameter } from '@azure/cosmos/';
import { AzureFunction, Context, HttpRequest } from '@azure/functions';

interface DeployData {
   project: string;
   deployEnv: string;
   tagName: string;
   branch: string;
   version?: string;
   timestamp: string;
   commit: {
      id: string;
      userName: string;
      branchURL: string;
      commitURL: string;
   };
}

const httpTrigger: AzureFunction = async function (
   context: Context,
   req: HttpRequest
): Promise<void> {
   context.log('HTTP trigger function processed a request.');
   const commitData = req.body ? req.body : {};
   console.log(commitData)  
   
   const endpoint = 'https://byrsouth-db.documents.azure.com:443'
   const key = 'dAL41yw8cKY4S8JdPopD86e00rEk2Us0ihQYFwWiy4BT1V9f7nldpyu436kung7dGa4F0CnzK8rMACDbNIzvjA==;'
   const client = new CosmosClient({endpoint, key})

   const container  = client.database('AppDeployDB').container('deployments');
   const project  = commitData.project;
   const deployEnv = commitData.deployEnv;

   console.log(`Project: ${project}`)
   console.log(`deployEnv: ${deployEnv}`)


   const querySpec: SqlQuerySpec = {
      query: "SELECT * FROM c where c.project = @project and c.deployEnv = @deployEnv",
      parameters: [
         {name: '@project', value:project},
         {name: '@deployEnv', value: deployEnv}
      ]
   }

   const items = await (await container.items.query(querySpec).fetchNext()).resources

   for( let i= 0; i < items.length; i++){
       container.item(items[i].id, items[i].id).delete()
   }   
   
   console.log('items')
   console.log(items)   
  
   context.bindings.outputDocument = commitData;
   console.log('Projct name: ' + commitData.project)
   const responseMessage = commitData;
};

function saveDeployInfo(deployData: DeployData, context: Context): void {
   context.bindings.outputDocument = deployData;
}

export default httpTrigger;
