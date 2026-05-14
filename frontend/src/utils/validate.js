export function validateName(value) {
  if (!value?.trim()) return 'Обязательное поле'
  if (value.trim().length < 2) return 'Минимум 2 символа'
  return ''
}

export function validateEmail(value) {
  if (!value?.trim()) return 'Email обязателен'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim())) return 'Неверный формат email'
  return ''
}

export function validatePhone(value) {
  if (!value?.trim()) return ''
  const digits = value.replace(/\D/g, '')
  const local = digits.startsWith('7') || digits.startsWith('8') ? digits.slice(1) : digits
  if (local.length < 10) return 'Введите полный номер телефона'
  return ''
}

export function validateUrl(value) {
  if (!value?.trim()) return ''
  if (!/^(https?:\/\/)?[\w\-]+(\.[\w\-]+)+[/#?]?.*$/i.test(value.trim())) return 'Неверный формат ссылки'
  return ''
}

// Формат ГГГГ-ММ
export function validateDate(value) {
  if (!value?.trim()) return ''
  if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(value.trim())) return 'Формат: ГГГГ-ММ (например, 2023-06)'
  return ''
}

// Дата окончания не раньше даты начала
export function validateDateRange(start, end) {
  if (!start?.trim() || !end?.trim()) return ''
  if (validateDate(start) || validateDate(end)) return ''
  if (new Date(end + '-01') < new Date(start + '-01')) return 'Дата окончания раньше даты начала'
  return ''
}

export function validateYear(value) {
  if (!value?.trim()) return ''
  const y = parseInt(value.trim(), 10)
  if (isNaN(y) || y < 1950 || y > 2099) return 'Корректный год: 1950–2099'
  return ''
}

export function validateRequired(value, label = 'Поле') {
  if (!value?.trim()) return `${label} обязательно`
  return ''
}

// Запускает все проверки по данным резюме; возвращает массив строк с ошибками
export function validateResume(resume) {
  const errors = []
  const blocks = resume.blocks_data || []

  for (const block of blocks) {
    if (!block.visible) continue
    const { block_type, content } = block

    if (block_type === 'contacts') {
      const nameErr = validateName(content.name)
      if (nameErr) errors.push(`Контакты: имя — ${nameErr}`)
      const emailErr = validateEmail(content.email)
      if (emailErr) errors.push(`Контакты: email — ${emailErr}`)
      const phoneErr = validatePhone(content.phone)
      if (phoneErr) errors.push(`Контакты: телефон — ${phoneErr}`)
      const websiteErr = validateUrl(content.website)
      if (websiteErr) errors.push(`Контакты: сайт — ${websiteErr}`)
    }

    if (block_type === 'experience') {
      ;(content.items || []).forEach((item, i) => {
        if (!item.position?.trim()) errors.push(`Опыт ${i + 1}: должность обязательна`)
        if (!item.company?.trim()) errors.push(`Опыт ${i + 1}: компания обязательна`)
        const startErr = validateDate(item.start_date)
        if (startErr) errors.push(`Опыт ${i + 1}: дата начала — ${startErr}`)
        if (item.end_date) {
          const endErr = validateDate(item.end_date)
          if (endErr) errors.push(`Опыт ${i + 1}: дата окончания — ${endErr}`)
          else {
            const rangeErr = validateDateRange(item.start_date, item.end_date)
            if (rangeErr) errors.push(`Опыт ${i + 1}: ${rangeErr}`)
          }
        }
      })
    }

    if (block_type === 'education') {
      ;(content.items || []).forEach((item, i) => {
        if (!item.institution?.trim()) errors.push(`Образование ${i + 1}: учебное заведение обязательно`)
        const yearErr = validateYear(item.year)
        if (yearErr) errors.push(`Образование ${i + 1}: год — ${yearErr}`)
      })
    }

    if (block_type === 'projects') {
      ;(content.items || []).forEach((item, i) => {
        if (!item.name?.trim()) errors.push(`Проект ${i + 1}: название обязательно`)
        const urlErr = validateUrl(item.url)
        if (urlErr) errors.push(`Проект ${i + 1}: ссылка — ${urlErr}`)
      })
    }

    if (block_type === 'skills') {
      ;(content.items || []).forEach((item, i) => {
        if (!item.trim()) errors.push(`Навыки: навык ${i + 1} пустой`)
      })
    }

    if (block_type === 'languages') {
      ;(content.items || []).forEach((item, i) => {
        if (!item.trim()) errors.push(`Языки: язык ${i + 1} пустой`)
      })
    }
  }

  return errors
}
