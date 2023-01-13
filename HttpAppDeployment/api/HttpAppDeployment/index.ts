import { AzureFunction, Context, HttpRequest } from '@azure/functions';

const deployData = {
   commit: {
      author: {
         email: 'byron.southerland@icloud.com',
         name: 'Byron',
         username: 'byrsouth',
         id: '372fd4511615e1928166130c45c6c8dde47da4be',
         timestamp: '2023-01-09T21:18:08-05:00',
      },
   },
   branch: 'master',
};

const httpTrigger: AzureFunction = async function (
   context: Context,
   req: HttpRequest
): Promise<void> {
   context.log('HTTP trigger function processed a request.');
   // const name = (req.query.name || (req.body && req.body.name));
   const commitData = req.body ? req.body : {};
   context.bindings.outputDocument = JSON.stringify(commitData);
   //  context.bindings.outputDocument = JSON.stringify(deployData);
   const responseMessage = commitData;

   context.res = {
      // status: 200, /* Defaults to 200 */
      body: req.body
   };
};

export default httpTrigger;
