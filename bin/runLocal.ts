import { config } from 'dotenv';
config();

import * as userCode from "../src/lambdaHandler";
import { Context } from 'aws-lambda';

const localEvent: userCode.LambdaEvent = {
    gymCapacityStatusEndpoint: process.env.GYM_CAPACITY_ENDPOINT!,
    googleSheetId: process.env.GOOGLE_SHEET_ID!,
    googleClientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
    googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY!,
};

const response = userCode.handler(localEvent, {} as Context, () => { });

response && response.then((res) => {
    console.log(res);
});