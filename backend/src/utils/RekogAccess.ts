import * as AWS from "aws-sdk";
import * as AWSXRay from "aws-xray-sdk";

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import {RekogItem} from "../models/RekogItem";
import * as uuid from 'uuid'
import { createLogger } from './logger'
import {CreateRekogRequest} from "../requests/CreateRekogRequest";
import {UpdateRekogRequest} from "../requests/UpdateRekogRequest";
import { UpdateRekogWithResultsRequest } from '../requests/UpdateRekogWithResultsRequest'
const logger = createLogger('rekogAccess');

const bucketName = process.env.REKOGS_S3_BUCKET_NAME;

const XAWS = AWSXRay.captureAWS(AWS);

export class RekogAccess {

    constructor(
        private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
        private readonly rekogsTable = process.env.REKOGS_TABLE,
        private readonly rekogsTableGsiByUserId = process.env.REKOGS_TABLE_GSI_BY_USERID,
        private readonly rekogsTableGsiByRekogId = process.env.REKOGS_TABLE_GSI_BY_REKOGID
    ) {
    }

    async getRekogsWithoutUser(): Promise<RekogItem[]> {
        logger.info('Fetching all rekogs');

        const result = await this.docClient.scan({
            TableName: this.rekogsTable
        }).promise();

        const items = result.Items

        logger.info("Fetching complete.", items)

        return items as RekogItem[]
    }

    async getRekogById(rekogId: string): Promise<RekogItem[]> {
        logger.info('Fetching rekog with specific rekogId', {rekogId: rekogId});

        const result = await this.docClient.query({
            TableName: this.rekogsTable,
            IndexName: this.rekogsTableGsiByRekogId,
            KeyConditionExpression: 'rekogId = :rekogId',
            ExpressionAttributeValues: {
                ':rekogId': rekogId
            }
        }).promise();

        const items = result.Items;

        logger.info("Fetching complete.", items)

        return items as RekogItem[]

    }

    async getRekogs(userId: string): Promise<RekogItem[]> {
        logger.info('Fetching all rekogs for userId', {userId: userId})

        const result = await this.docClient.query({
            TableName: this.rekogsTable,
            IndexName: this.rekogsTableGsiByUserId,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            }
        }).promise();

        const items = result.Items

        logger.info("Fetching complete.", items)

        return items as RekogItem[]
    }

    async createRekog(userId: string, newRekog: CreateRekogRequest): Promise<string> {
        const rekogId = uuid.v4();

        const newRekogWithAdditionalInfo = {
            userId: userId,
            rekogId: rekogId,
            ...newRekog
        }

        logger.info("Creating new rekog object:", newRekogWithAdditionalInfo);

        await this.docClient.put({
            TableName: this.rekogsTable,
            Item: newRekogWithAdditionalInfo
        }).promise();

        logger.info("Create complete.")

        return rekogId;

    }

    async createRekogWithoutUser(newRekog: CreateRekogRequest): Promise<string> {
        const rekogId = uuid.v4();

        const newRekogWithAdditionalInfo = {
            userId: "dummyUser",
            rekogId: rekogId,
            ...newRekog
        }

        logger.info("Creating new rekog object:", newRekogWithAdditionalInfo);

        await this.docClient.put({
            TableName: this.rekogsTable,
            Item: newRekogWithAdditionalInfo
        }).promise();

        logger.info("Create complete.")

        return rekogId;

    }

    async deleteRekog(rekogId: string) {
        logger.info("Deleting rekog:", {rekogId: rekogId});
        await this.docClient.delete({
            TableName: this.rekogsTable,
            Key: {
                "rekogId": rekogId
            }
        }).promise();
        logger.info("Delete complete.", {rekogId: rekogId});
    }

    async updateRekog(rekogId: string, updatedRekog: UpdateRekogRequest){

        logger.info("Updating todo:", {
            rekogId: rekogId,
            updatedRekog: updatedRekog
        });
        await this.docClient.update({
            TableName: this.rekogsTable,
            Key: {
                "rekogId": rekogId
            },
            UpdateExpression: "set #rekogName = :name, #userValidated = :userValidated",
            ExpressionAttributeNames: {
                "#rekogName": "name",
                "#userValidated": "userValidated"
            },
            ExpressionAttributeValues: {
                ":name": updatedRekog.name,
                ":userValidated": updatedRekog.userValidated,
            }
        }).promise()

        logger.info("Update complete.")

    }

    async updateRekogDetectedText(
      rekogId: string,
      updateRekogWithResultsRequest: UpdateRekogWithResultsRequest){

        logger.info("Updating rekog with detection results :", {
            rekogId: rekogId,
            request: updateRekogWithResultsRequest
        });
        await this.docClient.update({
            TableName: this.rekogsTable,
            Key: {
                "rekogId": rekogId
            },
            UpdateExpression: "set #detectedTexts = :detectedTexts, #userValidated = :userValidated",
            ExpressionAttributeNames: {
                "#detectedTexts": "rekogResults",
                "#userValidated": "userValidated",
            },
            ExpressionAttributeValues: {
                ":detectedTexts": updateRekogWithResultsRequest.rekogResults,
                ":userValidated": updateRekogWithResultsRequest.userValidated

            }
        }).promise()

        logger.info("Update complete.")

    }

    async updateTodoAttachmentUrl(rekogId: string, attachmentUrl: string){

        logger.info(`Updating rekogId ${rekogId} with attachmentUrl ${attachmentUrl}`)

        await this.docClient.update({
            TableName: this.rekogsTable,
            Key: {
                "rekogId": rekogId
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": `https://${bucketName}.s3.amazonaws.com/${attachmentUrl}`
            }
        }).promise();
    }

}
