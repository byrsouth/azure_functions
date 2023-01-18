import { AzureFunction, Context, HttpRequest } from '@azure/functions';
import { find } from './dbConnection';

const httpTrigger: AzureFunction = async function (
   context: Context,
   req: HttpRequest
): Promise<void> {
   const documents = await find();

   context.res = {
      body: documents,
   };
};

export default httpTrigger;
