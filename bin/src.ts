#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { TypescriptLambdaStack } from '../lib/typescript-lambda-stack';
import { config } from 'dotenv';
import { LambdaEvent } from '../src/lambdaHandler';
import { CronOptions } from 'aws-cdk-lib/aws-events';
config();

const app = new cdk.App();

const lambdaEvent: LambdaEvent = {
  gymCapacityStatusEndpoint: process.env.GYM_CAPACITY_ENDPOINT!,
  googleSheetId: process.env.GOOGLE_SHEET_ID!,
  googleClientEmail: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL!,
  googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY!,
};
// Cron Rule is in UTC
const cronRule: CronOptions = {
  minute: '*/15',
  hour: '0-5,12-23',
};

new TypescriptLambdaStack(app, 'GymCapacityTypescriptLambdaStack', {
  events: [{ event: lambdaEvent, schedule: cronRule }]
});