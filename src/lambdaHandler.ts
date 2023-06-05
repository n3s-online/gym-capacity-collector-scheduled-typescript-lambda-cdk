import { Handler } from 'aws-lambda';
import axios from 'axios';
import * as z from 'zod';

export const lambdaEventSchema = z.object({
    gymCapacityStatusEndpoint: z.string(),
});

export type LambdaEvent = z.infer<typeof lambdaEventSchema>;

export const handler: Handler = async (event, context) => {
    const parsedEvent = lambdaEventSchema.parse(event);
    const gymCapacityPercentage = await getGymCapacityPercentage(parsedEvent.gymCapacityStatusEndpoint);

    return {
        statusCode: 200,
        body: `Sucessful. Event message: ${gymCapacityPercentage}`
    };
};

const gymCapcityEndpointResponseSchema = z.object({
    percentage: z.number()
});

const getGymCapacityPercentage = async (endpoint: string): Promise<number> => {
    const response = await axios.post(endpoint, "accGroupEntityId=1", {
        headers: {
            "X-Requested-With": "XMLHttpRequest"
        },
    });

    console.log(`Response from gym capacity endpoint: ${response.status} ${response.statusText}`);
    const parsedResponse = gymCapcityEndpointResponseSchema.parse(response.data);
    return parsedResponse.percentage;
}