import { config } from 'dotenv';
config();

import * as userCode from "../src/lambdaHandler";
import { Context } from 'aws-lambda';

const localEvent: userCode.LambdaEvent = {
    message: "Hello World"
};

const response = userCode.handler(localEvent, {} as Context, () => { });

console.log(response);