import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getResume, exportPdf, exportDocx } from '../api/resumes'
import { getHhAuthUrl } from '../api/hh'
import { useResumeStore } from '../store/resumeStore'
import { validateResume } from '../utils/validate'
import BlockEditor from '../components/editor/BlockEditor'
import ColorPicker from '../components/editor/ColorPicker'
import ResumePreview from '../components/editor/ResumePreview'
import AiAssistant from '../components/editor/AiAssistant'
import '../styles/editorPage.css'

export default function EditorPage() {
  const { resumeId } = useParams()
  const navigate = useNavigate()
  const { resume, setResume } = useResumeStore()
  const [loading, setLoading] = useState(true)
  const [exporting, setExporting] = useState(null)
  const [importStatus, setImportStatus] = useState(null)
  const [importingHh, setImportingHh] = useState(false)
  const [validationErrors, setValidationErrors] = useState([])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    if (params.get('imported') === 'true') {
      setImportStatus('success')
      window.history.replaceState({}, '', `/editor/${resumeId}`)
    } else if (params.get('import_error') === 'true') {
      setImportStatus('error')
      window.history.replaceState({}, '', `/editor/${resumeId}`)
    }

    getResume(resumeId)
      .then(setResume)
      .finally(() => setLoading(false))
  }, [resumeId])

  const handleExport = async (format) => {
    const errors = validateResume(resume)
    if (errors.length > 0) {
      setValidationErrors(errors)
      return
    }
    setValidationErrors([])
    setExporting(format)
    try {
      const blob = format === 'pdf' ? await exportPdf(resumeId) : await exportDocx(resumeId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `resume.${format}`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExporting(null)
    }
  }

  const handleHhImport = async () => {
    setImportingHh(true)
    try {
      const url = await getHhAuthUrl(resumeId)
      window.location.href = url
    } catch {
      setImportStatus('error')
      setImportingHh(false)
    }
  }

  if (loading) return <div className="editor-page__loader">Загрузка резюме...</div>
  if (!resume) return <div className="editor-page__loader">Резюме не найдено</div>

  return (
    <div className="editor-page">
      <header className="editor-page__topbar">
        <button className="editor-page__back-btn" onClick={() => navigate('/')}>← Шаблоны</button>
        <span className="editor-page__topbar-title">Редактор резюме</span>
        <div className="editor-page__export-btns">
          <button
            className="editor-page__import-hh-btn"
            onClick={handleHhImport}
            disabled={importingHh}
          >
            {importingHh ? 'Перенаправление...' : 'Импорт с hh.ru'}
          </button>
          <button
            className="editor-page__export-btn"
            onClick={() => handleExport('pdf')}
            disabled={!!exporting}
          >
            {exporting === 'pdf' ? 'Генерация...' : 'Скачать PDF'}
          </button>
          <button
            className="editor-page__export-btn editor-page__export-btn--docx"
            onClick={() => handleExport('docx')}
            disabled={!!exporting}
          >
            {exporting === 'docx' ? 'Генерация...' : 'Скачать DOCX'}
          </button>
        </div>
      </header>

      {importStatus === 'success' && (
        <div className="editor-page__import-banner editor-page__import-banner--success">
          Данные с hh.ru успешно импортированы
          <button onClick={() => setImportStatus(null)}>✕</button>
        </div>
      )}
      {importStatus === 'error' && (
        <div className="editor-page__import-banner editor-page__import-banner--error">
          Не удалось импортировать данные с hh.ru. Проверьте HH_CLIENT_ID и HH_CLIENT_SECRET в .env
          <button onClick={() => setImportStatus(null)}>✕</button>
        </div>
      )}
      {validationErrors.length > 0 && (
        <div className="editor-page__validation-banner">
          <div>
            <strong>Исправьте ошибки перед экспортом:</strong>
            <ul>{validationErrors.map((e, i) => <li key={i}>{e}</li>)}</ul>
          </div>
          <button onClick={() => setValidationErrors([])}>✕</button>
        </div>
      )}

      <div className="editor-page__workspace">
        <aside className="editor-page__sidebar">
          <ColorPicker />
          <AiAssistant />
          <BlockEditor />
        </aside>
        <main className="editor-page__preview">
          <ResumePreview />
        </main>
      </div>
    </div>
  )
}
