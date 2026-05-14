import { useState } from 'react'
import { useResumeStore } from '../../store/resumeStore'
import '../../styles/blockForms.css'

export default function SkillsForm({ index, content }) {
  const { updateBlock } = useResumeStore()
  const items = content.items || []
  const [errors, setErrors] = useState({})

  const updateItem = (i, value) => {
    const updated = items.map((item, idx) => idx === i ? value : item)
    updateBlock(index, { ...content, items: updated })
  }

  const addItem = () => updateBlock(index, { ...content, items: [...items, ''] })

  const removeItem = (i) => {
    updateBlock(index, { ...content, items: items.filter((_, idx) => idx !== i) })
    setErrors(prev => { const e = { ...prev }; delete e[i]; return e })
  }

  const handleBlur = (i, value) => {
    setErrors(prev => ({ ...prev, [i]: !value.trim() ? 'Навык не может быть пустым' : '' }))
  }

  return (
    <div className="block-form">
      <div className="block-form__tag-list">
        {items.map((item, i) => (
          <div key={i} className="block-form__tag-row">
            <div className="block-form__tag-input-wrap">
              <input
                className={`block-form__input${errors[i] ? ' block-form__input--error' : ''}`}
                value={item}
                onChange={(e) => updateItem(i, e.target.value)}
                onBlur={(e) => handleBlur(i, e.target.value)}
                placeholder="Навык"
              />
              {errors[i] && <span className="block-form__error-msg">{errors[i]}</span>}
            </div>
            <button className="block-form__remove-btn" onClick={() => removeItem(i)}>✕</button>
          </div>
        ))}
      </div>
      <button className="block-form__add-btn" onClick={addItem}>+ Добавить навык</button>
    </div>
  )
}
