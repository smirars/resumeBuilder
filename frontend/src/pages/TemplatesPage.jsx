import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTemplates } from '../api/templates'
import { createResume } from '../api/resumes'
import '../styles/templatesPage.css'

function ClassicPreview({ color }) {
  return (
    <>
      <div className="templates-page__preview-header" style={{ background: color }}>
        <div className="templates-page__preview-name" />
        <div className="templates-page__preview-line" />
      </div>
      <div className="templates-page__preview-body">
        {[1, 2, 3].map((i) => (
          <div key={i} className="templates-page__preview-block">
            <div className="templates-page__preview-label" style={{ background: color }} />
            <div className="templates-page__preview-text" />
            <div className="templates-page__preview-text" style={{ width: '70%' }} />
          </div>
        ))}
      </div>
    </>
  )
}

function ModernPreview({ color }) {
  return (
    <>
      <div className="templates-page__preview-header" style={{ background: color }}>
        <div className="templates-page__preview-name" style={{ width: '140px' }} />
        <div className="templates-page__preview-line" />
        <div className="templates-page__preview-line" style={{ width: '100px', marginTop: 2 }} />
      </div>
      <div className="templates-page__preview-body templates-page__preview-body--two-col">
        <div className="templates-page__preview-sidebar">
          <div className="templates-page__preview-label" style={{ background: color }} />
          <div className="templates-page__preview-text" />
          <div className="templates-page__preview-text" style={{ width: '70%' }} />
          <div className="templates-page__preview-text" style={{ width: '55%', marginTop: 6 }} />
          <div className="templates-page__preview-text" style={{ width: '80%' }} />
        </div>
        <div className="templates-page__preview-main">
          {[1, 2].map((i) => (
            <div key={i} className="templates-page__preview-block">
              <div className="templates-page__preview-label" style={{ background: color }} />
              <div className="templates-page__preview-text" />
              <div className="templates-page__preview-text" style={{ width: '85%' }} />
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function MinimalPreview({ color }) {
  return (
    <>
      <div className="templates-page__preview-header templates-page__preview-header--minimal" style={{ borderBottomColor: color }}>
        <div className="templates-page__preview-name templates-page__preview-name--dark" />
        <div className="templates-page__preview-line templates-page__preview-line--dark" />
      </div>
      <div className="templates-page__preview-body">
        {[1, 2, 3].map((i) => (
          <div key={i} className="templates-page__preview-block">
            <div className="templates-page__preview-label templates-page__preview-label--minimal" />
            <div className="templates-page__preview-text" />
            <div className="templates-page__preview-text" style={{ width: '70%' }} />
          </div>
        ))}
      </div>
    </>
  )
}

const PREVIEW_BY_ID = {
  1: ClassicPreview,
  2: ModernPreview,
  3: MinimalPreview,
}

export default function TemplatesPage() {
  const [templates, setTemplates] = useState([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    getTemplates()
      .then(setTemplates)
      .finally(() => setLoading(false))
  }, [])

  const handleSelect = async (template) => {
    setCreating(template.id)
    try {
      const resume = await createResume(template.id)
      navigate(`/editor/${resume.id}`)
    } finally {
      setCreating(null)
    }
  }

  return (
    <div className="templates-page">
      <header className="templates-page__header">
        <h1 className="templates-page__title">Конструктор резюме</h1>
        <p className="templates-page__subtitle">Выберите шаблон и начните заполнять</p>
      </header>

      {loading ? (
        <div className="templates-page__loader">Загрузка шаблонов...</div>
      ) : (
        <div className="templates-page__grid">
          {templates.map((t) => {
            const Preview = PREVIEW_BY_ID[t.id] || ClassicPreview
            return (
              <div key={t.id} className="templates-page__card">
                <div className="templates-page__preview">
                  <Preview color={t.available_colors[0]} />
                </div>
                <div className="templates-page__card-info">
                  <h2 className="templates-page__card-title">{t.name}</h2>
                  <p className="templates-page__card-desc">{t.description}</p>
                  <div className="templates-page__colors">
                    {t.available_colors.map((c) => (
                      <span key={c} className="templates-page__color-dot" style={{ background: c }} />
                    ))}
                  </div>
                  <button
                    className="templates-page__btn"
                    onClick={() => handleSelect(t)}
                    disabled={creating === t.id}
                  >
                    {creating === t.id ? 'Создание...' : 'Использовать'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
