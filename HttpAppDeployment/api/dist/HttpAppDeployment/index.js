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
const cosmos_1 = require("@azure/cosmos/");
const httpTrigger = function (context, req) {
    return __awaiter(this, void 0, void 0, function* () {
        context.log('HTTP trigger function processed a request.');
        const commitData = req.body ? req.body : {};
        console.log(commitData);
        const endpoint = 'https://byrsouth-db.documents.azure.com:443';
        const key = 'dAL41yw8cKY4S8JdPopD86e00rEk2Us0ihQYFwWiy4BT1V9f7nldpyu436kung7dGa4F0CnzK8rMACDbNIzvjA==;';
        const client = new cosmos_1.CosmosClient({ endpoint, key });
        const container = client.database('AppDeployDB').container('deployments');
        const project = commitData.project;
        const deployEnv = commitData.deployEnv;
        console.log(`Project: ${project}`);
        console.log(`deployEnv: ${deployEnv}`);
        const querySpec = {
            query: "SELECT * FROM c where c.project = @project and c.deployEnv = @deployEnv",
            parameters: [
                { name: '@project', value: project },
                { name: '@deployEnv', value: deployEnv }
            ]
        };
        const items = yield (yield container.items.query(querySpec).fetchNext()).resources;
        for (let i = 0; i < items.length; i++) {
            container.item(items[i].id, items[i].id).delete();
        }
        console.log('items');
        console.log(items);
        context.bindings.outputDocument = commitData;
        console.log('Projct name: ' + commitData.project);
        const responseMessage = commitData;
    });
};
function saveDeployInfo(deployData, context) {
    context.bindings.outputDocument = deployData;
}
exports.default = httpTrigger;
//# sourceMappingURL=index.js.map