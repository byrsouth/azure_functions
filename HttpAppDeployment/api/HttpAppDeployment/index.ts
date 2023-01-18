import { AzureFunction, Context, HttpRequest } from '@azure/functions';

interface DeployData {
   commit: {
      author: {
         email: string;
         name: string;
         username: string;
         id: string;
         timestamp: string;
      };
   };
   branch: string;
}


const httpTrigger: AzureFunction = async function (
   context: Context,
   req: HttpRequest
): Promise<void> {
   context.log('HTTP trigger function processed a request.');
   // const name = (req.query.name || (req.body && req.body.name));
   const commitData: DeployData = req.body ? req.body : {};

   context.bindings.outputDocument = commitData;
   const responseMessage = commitData;
   context.res = {
      // status: 200, /* Defaults to 200 */
      body: req.body,
   };
};

function saveDeployInfo(deployData: DeployData, context: Context): void{   
   context.bindings.outputDocument =deployData;
}


export default httpTrigger;
