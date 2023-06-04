import { Handler } from 'aws-lambda';
import * as z from 'zod';

export const lambdaEventSchema = z.object({
    message: z.string()
});

export type LambdaEvent = z.infer<typeof lambdaEventSchema>;

export const handler: Handler = async (event, context) => {
    return {
        statusCode: 200,
        body: `Sucessful. Event message: ${event.message}`
    };
};
