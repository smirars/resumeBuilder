import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000' })

export const analyzeResume = (resumeId) =>
  api.post(`/api/ai/analyze/${resumeId}`).then(r => r.data)
