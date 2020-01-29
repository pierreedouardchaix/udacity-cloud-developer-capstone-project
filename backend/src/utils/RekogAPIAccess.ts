import * as AWS from 'aws-sdk'
import { createLogger } from './logger'
const logger = createLogger('rekogAccess');

const bucketName = process.env.REKOGS_S3_BUCKET_NAME;

export class RekogAPIAccess {

  constructor(
    private readonly rekogAPIAccess = new AWS.Rekognition(
      {
        apiVersion: '2016-06-27',
        region: 'eu-west-1'
    })) {
  }

  async detectText(imageId: string): Promise<AWS.Rekognition.Types.DetectTextResponse>{

    var detectionParams = {
      Image: {
        S3Object: {
          Bucket: bucketName,
          Name: imageId
        }
      }
    };

    logger.info("detection parameters", {detectionParams: detectionParams});

    return this.rekogAPIAccess.detectText(
      detectionParams
    ).promise();

  }


}
