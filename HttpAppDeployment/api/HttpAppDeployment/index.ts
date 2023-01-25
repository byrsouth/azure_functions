import { AzureFunction, Context, HttpRequest } from '@azure/functions';

interface DeployData {
   project: string;
   deployEnv: string;
   tagName: string;
   branch: string;
   version?: string;
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
   // const name = (req.query.name || (req.body && req.body.name));
   const commitData: DeployData = req.body ? req.body : {};

   context.bindings.outputDocument = commitData;
   const responseMessage = commitData;
};

function saveDeployInfo(deployData: DeployData, context: Context): void {
   context.bindings.outputDocument = deployData;
}

export default httpTrigger;
