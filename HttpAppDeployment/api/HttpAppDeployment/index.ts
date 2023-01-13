import { AzureFunction, Context, HttpRequest } from '@azure/functions';

interface DeployData {
   commit: {
      author: {
         email: string,
         name: string,
         username: string,
         id: string,
         timestamp: string,
      },
   },
   branch: string,
};

const httpTrigger: AzureFunction = async function (
   context: Context,
   req: HttpRequest
): Promise<void> {
   context.log('HTTP trigger function processed a request.');   
   const commitData = req.body ? req.body : {};
   saveDeployInfo(commitData, context);

   const responseMessage = JSON.stringify(commitData);   
   context.res = {
      // status: 200, /* Defaults to 200 */
      body: responseMessage
   };   
};

function saveDeployInfo(deployData: DeployData, context: Context): void{   
   context.bindings.outputDocument =deployData;
}


export default httpTrigger;
