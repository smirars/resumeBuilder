import axios from 'axios'

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function getHhAuthUrl(resumeId) {
  const { data } = await axios.get(`${BASE}/api/hh/auth-url`, {
    params: { resume_id: resumeId },
  })
  return data.url
}
