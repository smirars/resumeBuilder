import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8000' })

export const getTemplates = () => api.get('/api/templates').then(r => r.data)
export const getTemplate = (id) => api.get(`/api/templates/${id}`).then(r => r.data)
