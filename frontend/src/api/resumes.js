import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8000' })

export const createResume = (templateId, color) =>
  api.post('/api/resumes', { template_id: templateId, color }).then(r => r.data)

export const getResume = (id) =>
  api.get(`/api/resumes/${id}`).then(r => r.data)

export const updateResume = (id, data) =>
  api.put(`/api/resumes/${id}`, data).then(r => r.data)

export const exportPdf = (id) =>
  api.post(`/api/export/pdf/${id}`, {}, { responseType: 'blob' }).then(r => r.data)

export const exportDocx = (id) =>
  api.post(`/api/export/docx/${id}`, {}, { responseType: 'blob' }).then(r => r.data)
