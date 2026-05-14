import { useState } from 'react'
import { useResumeStore } from '../../store/resumeStore'
import { validateName, validateEmail, validatePhone, validateUrl } from '../../utils/validate'
import { PhoneInput } from '../ui/PhoneInput'
import '../../styles/blockForms.css'

const VALIDATORS = {
  name: validateName,
  email: validateEmail,
  phone: validatePhone,
  website: validateUrl,
}

export default function ContactsForm({ index, content }) {
  const { updateBlock } = useResumeStore()
  const [errors, setErrors] = useState({})

  const update = (field, value) => {
    updateBlock(index, { ...content, [field]: value })
  }

  const handleBlur = (field, value) => {
    const validator = VALIDATORS[field]
    if (validator) {
      setErrors(prev => ({ ...prev, [field]: validator(value) }))
    }
  }

  const fields = [
    { key: 'name', label: 'Имя и фамилия' },
    { key: 'email', label: 'Email' },
    { key: 'location', label: 'Город' },
    { key: 'website', label: 'Сайт / GitHub' },
  ]

  return (
    <div className="block-form">
      {fields.map(({ key, label }) => (
        <label key={key} className="block-form__field">
          <span className="block-form__label">{label}</span>
          <input
            className={`block-form__input${errors[key] ? ' block-form__input--error' : ''}`}
            value={content[key] || ''}
            onChange={(e) => update(key, e.target.value)}
            onBlur={(e) => handleBlur(key, e.target.value)}
          />
          {errors[key] && <span className="block-form__error-msg">{errors[key]}</span>}
        </label>
      ))}

      <label className="block-form__field">
        <span className="block-form__label">Телефон</span>
        <PhoneInput
          value={content.phone || ''}
          onChange={(v) => update('phone', v)}
          onBlur={() => handleBlur('phone', content.phone || '')}
          className={`block-form__input${errors.phone ? ' block-form__input--error' : ''}`}
        />
        {errors.phone && <span className="block-form__error-msg">{errors.phone}</span>}
      </label>
    </div>
  )
}
