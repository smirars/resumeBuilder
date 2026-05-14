import { useState } from 'react'
import { useResumeStore } from '../../store/resumeStore'
import { analyzeResume } from '../../api/ai'
import '../../styles/aiAssistant.css'

const TYPE_LABELS = {
  grammar:    { label: 'Грамматика', color: '#dc2626' },
  spelling:   { label: 'Орфография', color: '#ea580c' },
  style:      { label: 'Стиль',      color: '#7c3aed' },
  suggestion: { label: 'Совет',      color: '#2563eb' },
}

export default function AiAssistant() {
  const { resume } = useResumeStore()
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const handleAnalyze = async () => {
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const data = await analyzeResume(resume.id)
      setResult(data)
    } catch (e) {
      const msg = e.response?.data?.detail || 'Ошибка при анализе'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  if (!resume) return null

  return (
    <div className="ai-assistant">
      <div className="ai-assistant__header">
        <h3 className="ai-assistant__title">ИИ-ассистент</h3>
        <button
          className="ai-assistant__btn"
          onClick={handleAnalyze}
          disabled={loading}
        >
          {loading ? 'Анализирую...' : 'Проверить текст'}
        </button>
      </div>

      {loading && (
        <div className="ai-assistant__loader">
          <div className="ai-assistant__spinner" />
          <span>Анализирую резюме...</span>
        </div>
      )}

      {error && (
        <div className="ai-assistant__error">
          {error.includes('GROQ_API_KEY')
            ? 'Добавьте GROQ_API_KEY в .env файл бэкенда'
            : error}
        </div>
      )}

      {result && (
        <div className="ai-assistant__result">
          <p className="ai-assistant__summary">{result.summary}</p>

          {result.issues.length === 0 ? (
            <div className="ai-assistant__no-issues">Ошибок не найдено</div>
          ) : (
            <div className="ai-assistant__issues">
              {result.issues.map((issue, i) => {
                const meta = TYPE_LABELS[issue.type] || TYPE_LABELS.suggestion
                return (
                  <div key={i} className="ai-assistant__issue">
                    <div className="ai-assistant__issue-top">
                      <span
                        className="ai-assistant__badge"
                        style={{ background: meta.color }}
                      >
                        {meta.label}
                      </span>
                      <span className="ai-assistant__issue-block">{issue.block}</span>
                    </div>
                    <div className="ai-assistant__original">«{issue.original}»</div>
                    <div className="ai-assistant__improved">→ {issue.improved}</div>
                    <div className="ai-assistant__explanation">{issue.explanation}</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
