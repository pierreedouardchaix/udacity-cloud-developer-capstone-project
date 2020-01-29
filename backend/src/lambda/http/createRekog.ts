import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { CreateRekogRequest } from '../../requests/CreateRekogRequest'
import {getUserIdFromEvent} from "../../auth/utils";
import {RekogAccess} from "../../utils/RekogAccess";

const rekogAccess = new RekogAccess();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {

  const userId = getUserIdFromEvent(event);

  const newRekog: CreateRekogRequest = JSON.parse(event.body);
  const rekogId = await rekogAccess.createRekog(userId, newRekog);

  return {
    statusCode: 201,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      item:
          {
            rekogId: rekogId,
            ...newRekog
          }
    })
  };
};
