/**
 * Fields in a request to create a single rekog item.
 */
export interface CreateRekogRequest {
  createdAt: string
  name: string
  rekogResults: Array<string>
  userValidated: Array<boolean>
  attachmentUrl?: string
}
