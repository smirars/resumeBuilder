import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8000' })

export const uploadPhoto = (file) => {
  const form = new FormData()
  form.append('file', file)
  return api.post('/api/upload/photo', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }).then(r => r.data.url)
}
