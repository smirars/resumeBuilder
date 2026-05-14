import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8000' })

export const analyzeResume = (resumeId) =>
  api.post(`/api/ai/analyze/${resumeId}`).then(r => r.data)
