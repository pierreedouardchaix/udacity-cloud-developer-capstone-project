/**
 * Fields in a request to update a single rekog item.
 */
export interface UpdateRekogRequest {
  name: string
  userValidated: Array<boolean>
}
