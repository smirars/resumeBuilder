import { BrowserRouter, Routes, Route } from 'react-router-dom'
import TemplatesPage from './pages/TemplatesPage'
import EditorPage from './pages/EditorPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<TemplatesPage />} />
        <Route path="/editor/:resumeId" element={<EditorPage />} />
      </Routes>
    </BrowserRouter>
  )
}
