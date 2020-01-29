import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult, APIGatewayProxyHandler } from 'aws-lambda'
import * as uuid from 'uuid';
import * as AWS from 'aws-sdk';
import * as AWSXRay from "aws-xray-sdk";

import { createLogger } from '../../utils/logger'
const logger = createLogger('generateUploadUrl')

const XAWS = AWSXRay.captureAWS(AWS);

const bucketName = process.env.REKOGS_S3_BUCKET_NAME;
const urlExpiration = process.env.SIGNED_URL_EXPIRATION;
const s3 = new XAWS.S3({
  signatureVersion: 'v4'
});

import {RekogAccess} from "../../utils/RekogAccess";

const rekogAccess = new RekogAccess();

export const handler: APIGatewayProxyHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const rekogId = event.pathParameters.rekogId;
  const attachmentId = uuid.v4();

  logger.info("Generating upload URL:", {
    rekogId: rekogId,
    attachmentId: attachmentId
  });

  const uploadUrl = s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: attachmentId,
    Expires: urlExpiration
  });

  await rekogAccess.updateTodoAttachmentUrl(rekogId, attachmentId);

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*'
    },
    body: JSON.stringify({
      uploadUrl: uploadUrl
    })
  }
};
