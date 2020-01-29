import { apiEndpoint } from '../config'
import { RekogItem } from '../types/RekogItem';
import { CreateRekogRequest } from '../types/CreateRekogRequest';
import Axios from 'axios'
import { UpdateRekogRequest } from '../types/UpdateRekogRequest';

export async function getRekogs(idToken: string): Promise<RekogItem[]> {
  console.log('Fetching rekogs')

  const response = await Axios.get(`${apiEndpoint}/rekogs`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Rekogs:', response.data)
  return response.data.items
}

export async function createRekog(
  idToken: string,
  newRekog: CreateRekogRequest
): Promise<RekogItem> {
  const response = await Axios.post(`${apiEndpoint}/rekogs`,  JSON.stringify(newRekog), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchRekog(
  idToken: string,
  rekogId: string,
  updatedRekog: UpdateRekogRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/rekogs/${rekogId}`, JSON.stringify(updatedRekog), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteRekog(
  idToken: string,
  rekogId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/rekogs/${rekogId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  rekogId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/rekogs/${rekogId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}

export async function detectText(idToken: string, rekogId: string): Promise<void>{
  await Axios.get(`${apiEndpoint}/rekogs/${rekogId}/detect`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}
