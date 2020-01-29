import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'

import { RekogAccess } from '../../utils/RekogAccess'
import { RekogItem } from '../../models/RekogItem'
import { RekogAPIAccess } from '../../utils/RekogAPIAccess'
import { createLogger } from '../../utils/logger'
import { UpdateRekogWithResultsRequest } from '../../requests/UpdateRekogWithResultsRequest'
const logger = createLogger('generateUploadUrl')

// const XAWS = AWSXRay.captureAWS(AWS);

const rekogAccess = new RekogAccess();
const rekogAPIAccess = new RekogAPIAccess();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  // Get rekogId
  const rekogId = event.pathParameters.rekogId;
  logger.info("Begin text detection", {rekogId: rekogId})

  // Get image id from attachmentUrl
  const rekogItems: RekogItem[] = await rekogAccess.getRekogById(rekogId);

  if (rekogItems.length === 0){
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': '*'
      },
      body: JSON.stringify({
        item: "RekogId could not be found."
      })
    };
  }

  // Detect text with API
  const attachmentId = rekogItems[0].attachmentUrl.split("/").slice(-1)[0];

  const detectionResults = await rekogAPIAccess.detectText(attachmentId);

  const detectedTexts: Array<string> = detectionResults.TextDetections.filter(
    e => e.Type === "LINE"
  ).map(
    e => e.DetectedText
  );

  const userValidated: Array<boolean> = detectedTexts.map(
    _ => false
  );

  const updateRekogWithResultsRequest = {
    rekogResults: detectedTexts,
    userValidated: userValidated
  } as UpdateRekogWithResultsRequest

  await rekogAccess.updateRekogDetectedText(rekogId, updateRekogWithResultsRequest);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      detectedTexts: detectedTexts
    })
  };

};
