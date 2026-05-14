import { useState } from 'react'
import { useResumeStore } from '../../store/resumeStore'
import { validateRequired, validateDate, validateDateRange } from '../../utils/validate'
import '../../styles/blockForms.css'

export default function ExperienceForm({ index, content }) {
  const { updateBlock } = useResumeStore()
  const items = content.items || []
  const [errors, setErrors] = useState({})

  const updateItem = (i, field, value) => {
    const updated = items.map((item, idx) => idx === i ? { ...item, [field]: value } : item)
    updateBlock(index, { ...content, items: updated })
  }

  const addItem = () => {
    updateBlock(index, {
      ...content,
      items: [...items, { company: '', position: '', start_date: '', end_date: '', description: '' }],
    })
  }

  const removeItem = (i) => {
    updateBlock(index, { ...content, items: items.filter((_, idx) => idx !== i) })
    setErrors(prev => { const e = { ...prev }; delete e[i]; return e })
  }

  const setFieldErr = (i, field, error) => {
    setErrors(prev => ({ ...prev, [i]: { ...(prev[i] || {}), [field]: error } }))
  }

  const handleBlur = (i, field, value) => {
    const item = items[i]
    let error = ''

    if (field === 'position') {
      error = validateRequired(value, 'Должность')
    } else if (field === 'company') {
      error = validateRequired(value, 'Компания')
    } else if (field === 'start_date') {
      error = validateDate(value)
      if (!error && item.end_date) {
        setFieldErr(i, 'end_date', validateDateRange(value, item.end_date))
      }
    } else if (field === 'end_date') {
      error = validateDate(value)
      if (!error) error = validateDateRange(item.start_date, value)
    }

    setFieldErr(i, field, error)
  }

  const fieldErr = (i, field) => errors[i]?.[field] || ''

  return (
    <div className="block-form">
      {items.map((item, i) => (
        <div key={i} className="block-form__item">
          <div className="block-form__item-header">
            <span className="block-form__item-num">Место {i + 1}</span>
            <button className="block-form__remove-btn" onClick={() => removeItem(i)}>✕</button>
          </div>
          {[
            { key: 'position', label: 'Должность' },
            { key: 'company', label: 'Компания' },
            { key: 'start_date', label: 'Дата начала (ГГГГ-ММ)' },
            { key: 'end_date', label: 'Дата окончания (или пусто)' },
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
              rows={3}
              value={item.description || ''}
              onChange={(e) => updateItem(i, 'description', e.target.value)}
            />
          </label>
        </div>
      ))}
      <button className="block-form__add-btn" onClick={addItem}>+ Добавить место работы</button>
    </div>
  )
}
