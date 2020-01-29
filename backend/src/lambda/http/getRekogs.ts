import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import {getUserIdFromEvent} from "../../auth/utils";
import {RekogAccess} from "../../utils/RekogAccess";

const rekogAccess = new RekogAccess();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

    const userId = getUserIdFromEvent(event);

    const rekogs = await rekogAccess.getRekogs(userId);

    // Send results
    return {
        statusCode: 200,
        headers: {
            'Access-Control-Allow-Origin': '*'
        },
        body: JSON.stringify({
            items: rekogs
        })
    }
};
