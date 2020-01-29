import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyResult } from 'aws-lambda'
import { UpdateRekogRequest } from '../../requests/UpdateRekogRequest'
import {RekogAccess} from "../../utils/RekogAccess";

const rekogAccess = new RekogAccess();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const rekogId = event.pathParameters.rekogId;

  const updatedRekog: UpdateRekogRequest = JSON.parse(event.body);

  await rekogAccess.updateRekog(rekogId, updatedRekog);

  return {
    statusCode: 202,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({})
  }
};
