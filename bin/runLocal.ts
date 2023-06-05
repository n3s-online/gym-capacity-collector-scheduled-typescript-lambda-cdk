import { config } from 'dotenv';
config();

import * as userCode from "../src/lambdaHandler";
import { Context } from 'aws-lambda';

const localEvent: userCode.LambdaEvent = {
    gymCapacityStatusEndpoint: process.env.GYM_CAPACITY_ENDPOINT!
};

const response = userCode.handler(localEvent, {} as Context, () => { });

response && response.then((res) => {
    console.log(res);
});