function formatPhone(digits) {
  const d = digits.slice(0, 10)
  if (!d) return ''
  let r = '+7 (' + d.slice(0, 3)
  if (d.length > 3) r += ') ' + d.slice(3, 6)
  if (d.length > 6) r += '-' + d.slice(6, 8)
  if (d.length > 8) r += '-' + d.slice(8, 10)
  return r
}

function extractDigits(value) {
  const d = value.replace(/\D/g, '')
  return d.startsWith('7') || d.startsWith('8') ? d.slice(1) : d
}

export function PhoneInput({ value, onChange, onBlur, className }) {
  const handleChange = (e) => {
    const digits = extractDigits(e.target.value).slice(0, 10)
    onChange(digits ? formatPhone(digits) : '')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Backspace') {
      e.preventDefault()
      const digits = extractDigits(value)
      const shorter = digits.slice(0, -1)
      onChange(shorter ? formatPhone(shorter) : '')
    }
  }

  return (
    <input
      type="tel"
      value={value}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      onBlur={onBlur}
      className={className}
      placeholder="+7 (___) ___-__-__"
    />
  )
}
