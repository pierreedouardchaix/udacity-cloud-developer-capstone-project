/**
 * Fields in a request to update a single rekog item with Rekognition results.
 */
export interface UpdateRekogWithResultsRequest {
  rekogResults: Array<string>
  userValidated: Array<boolean>
}
