# Serverless Rekogs

This application is a demonstrator for Amazon Rekognition text detection service using Amazon lambda functions.

## Functionality of the application

This application allows creating/removing/updating/fetching Rekog items.

Each Rekog item can optionally have an attachment image. However, this is highly recommended, as the Amazon Rekognition service is used only if an image is uploaded.
 
Indeed, after the image is uploaded, Amazon Rekognition is automatically called in order to detect text in the uploaded image.

The user can then indicate in the application, for each detected text, whether the detection from Amazon Rekognition was accurate or not.

Each user only has access to Rekog items that he/she has created.

## Rekog items

The application stores Rekog items, and each Rekog item contains the following fields:

* `rekogId` (string) - a unique id for an item
* `userId` (string) - the id of the user that created the item
* `createdAt` (string) - date and time when an item was created
* `name` (string) - user-provided name of a Rekog item 
* `rekogResults` (array of strings) - the detected texts from Amazon Rekognition
* `userValidated` (array of booleans) - the user-provided accuracy results for each detected text
* `attachmentUrl` (string) (optional) - a URL pointing to an image attached to a Rekog item


## Lambda functions implemented

The following lambda functions have been implemented:

* `Auth` - implements a custom authorizer for API Gateway that is added to all other functions.

* `GetRekogs` - returns all Rekog items for a current user.

* `CreateRekog` - creates a new Rekog item for a current user. 

* `UpdateRekog` - updates a Rekog item created by a current user.

* `DeleteRekog` - delete a Rekog item created by a current user.

* `GenerateUploadUrl` - returns a pre-signed URL that can be used to upload an attachment file for a Rekog item.

* `DetectText` - returns the detected texts in the attachment image for a given Rekog item.

## Launching the application

Navigate to the `client` directory and run:
```
npm run start
```
Then go to `http://localhost:3000`.
