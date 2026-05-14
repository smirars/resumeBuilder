import { useResumeStore } from '../../store/resumeStore'
import '../../styles/colorPicker.css'

const COLORS = [
  '#2563eb', '#16a34a', '#dc2626', '#7c3aed', '#0f172a',
  '#0f766e', '#b45309', '#be185d', '#1d4ed8', '#374151',
]

const FONTS = [
  { name: 'Arial', label: 'Arial' },
  { name: 'Times New Roman', label: 'Times New Roman' },
  { name: 'Georgia', label: 'Georgia' },
  { name: 'Verdana', label: 'Verdana' },
  { name: 'Trebuchet MS', label: 'Trebuchet MS' },
  { name: 'Calibri', label: 'Calibri' },
]

export default function ColorPicker() {
  const { resume, setColor, setFont } = useResumeStore()
  if (!resume) return null

  return (
    <div className="color-picker">
      <div className="color-picker__block">
        <h3 className="color-picker__title">Цвет оформления</h3>
        <div className="color-picker__grid">
          {COLORS.map((c) => (
            <button
              key={c}
              className={`color-picker__dot${resume.color === c ? ' color-picker__dot--active' : ''}`}
              style={{ background: c }}
              onClick={() => setColor(c)}
              title={c}
            />
          ))}
        </div>
      </div>

      <div className="color-picker__block">
        <h3 className="color-picker__title">Шрифт</h3>
        <div className="color-picker__font-list">
          {FONTS.map((f) => (
            <button
              key={f.name}
              className={`color-picker__font-btn${resume.font === f.name ? ' color-picker__font-btn--active' : ''}`}
              style={{ fontFamily: f.name }}
              onClick={() => setFont(f.name)}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
