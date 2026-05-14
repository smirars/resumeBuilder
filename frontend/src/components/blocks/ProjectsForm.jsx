import { useState } from 'react'
import { useResumeStore } from '../../store/resumeStore'
import { validateRequired, validateUrl } from '../../utils/validate'
import '../../styles/blockForms.css'

export default function ProjectsForm({ index, content }) {
  const { updateBlock } = useResumeStore()
  const items = content.items || []
  const [errors, setErrors] = useState({})

  const updateItem = (i, field, value) => {
    const updated = items.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
    updateBlock(index, { ...content, items: updated })
  }

  const addItem = () => {
    updateBlock(index, { ...content, items: [...items, { name: '', description: '', url: '' }] })
  }

  const removeItem = (i) => {
    updateBlock(index, { ...content, items: items.filter((_, idx) => idx !== i) })
    setErrors(prev => { const e = { ...prev }; delete e[i]; return e })
  }

  const handleBlur = (i, field, value) => {
    let error = ''
    if (field === 'name') error = validateRequired(value, 'Название')
    else if (field === 'url') error = validateUrl(value)
    setErrors(prev => ({ ...prev, [i]: { ...(prev[i] || {}), [field]: error } }))
  }

  const fieldErr = (i, field) => errors[i]?.[field] || ''

  return (
    <div className="block-form">
      {items.map((item, i) => (
        <div key={i} className="block-form__item">
          <div className="block-form__item-header">
            <span className="block-form__item-num">Проект {i + 1}</span>
            <button className="block-form__remove-btn" onClick={() => removeItem(i)}>✕</button>
          </div>
          {[
            { key: 'name', label: 'Название' },
            { key: 'url', label: 'Ссылка' },
          ].map(({ key, label }) => (
            <label key={key} className="block-form__field">
              <span className="block-form__label">{label}</span>
              <input
                className={`block-form__input${fieldErr(i, key) ? ' block-form__input--error' : ''}`}
                value={item[key] || ''}
                onChange={(e) => updateItem(i, key, e.target.value)}
                onBlur={(e) => handleBlur(i, key, e.target.value)}
              />
              {fieldErr(i, key) && <span className="block-form__error-msg">{fieldErr(i, key)}</span>}
            </label>
          ))}
          <label className="block-form__field">
            <span className="block-form__label">Описание</span>
            <textarea
              className="block-form__textarea"
              rows={2}
              value={item.description || ''}
              onChange={(e) => updateItem(i, 'description', e.target.value)}
            />
          </label>
        </div>
      ))}
      <button className="block-form__add-btn" onClick={addItem}>+ Добавить проект</button>
    </div>
  )
}
