export interface RekogItem {
  userId: string
  rekogId: string
  createdAt: string
  name: string
  rekogResults: Array<string>
  userValidated: Array<boolean>
  attachmentUrl?: string
}
