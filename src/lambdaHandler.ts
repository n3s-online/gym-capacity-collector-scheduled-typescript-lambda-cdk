import { Handler } from 'aws-lambda';
import axios from 'axios';
import * as z from 'zod';
import { GoogleSpreadsheet } from "google-spreadsheet";

export const lambdaEventSchema = z.object({
    gymCapacityStatusEndpoint: z.string(),
    googleSheetId: z.string(),
    googleClientEmail: z.string(),
    googlePrivateKey: z.string(),
});

export type LambdaEvent = z.infer<typeof lambdaEventSchema>;

export const handler: Handler = async (event, context) => {
    const parsedEvent = lambdaEventSchema.parse(event);
    const gymCapacityPercentage = await getGymCapacityPercentage(parsedEvent.gymCapacityStatusEndpoint);
    await addRowToSpreadsheet(parsedEvent, gymCapacityPercentage);

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

const addRowToSpreadsheet = async ({ googleSheetId, googleClientEmail, googlePrivateKey }: LambdaEvent, gymCapacityPercentage: number) => {
    const date = new Date();
    const doc = new GoogleSpreadsheet(googleSheetId);

    await doc.useServiceAccountAuth({
        client_email: googleClientEmail,
        private_key: googlePrivateKey,
    });

    await doc.loadInfo();

    const dataSheet = doc.sheetsByTitle["Data"];
    await dataSheet.loadHeaderRow();

    const formattedDate = date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' });

    await dataSheet.addRow({ "Time": formattedDate, "Capacity": gymCapacityPercentage });

}