import { useResumeStore } from '../../store/resumeStore'
import '../../styles/resumePreview.css'

const TEMPLATE_MODIFIER = {
  1: 'resume-preview--classic',
  2: 'resume-preview--modern',
  3: 'resume-preview--minimal',
}

export default function ResumePreview() {
  const { resume } = useResumeStore()
  if (!resume) return null

  const { blocks_data, color, font, template_id } = resume
  const visible = blocks_data.filter((b) => b.visible)

  const contacts = visible.find((b) => b.block_type === 'contacts')?.content || {}
  const photo = visible.find((b) => b.block_type === 'photo')?.content?.url || ''
  const others = visible.filter((b) => b.block_type !== 'contacts' && b.block_type !== 'photo')

  const modifier = TEMPLATE_MODIFIER[template_id] || 'resume-preview--classic'

  // Для минималистичного шаблона: белый фон, акцентный цвет только снизу
  const headerStyle = template_id === 3
    ? { borderBottomColor: color }
    : { background: color }

  return (
    <div
      className={`resume-preview ${modifier}`}
      style={{ fontFamily: `'${font || 'Arial'}', Arial, sans-serif` }}
    >
      {contacts.name && (
        <div className="resume-preview__header" style={headerStyle}>
          <div className="resume-preview__header-inner">
            <div className="resume-preview__header-text">
              <h1 className="resume-preview__name">{contacts.name}</h1>
              <div className="resume-preview__contact-row">
                {contacts.email && <span>{contacts.email}</span>}
                {contacts.phone && <span>{contacts.phone}</span>}
                {contacts.location && <span>{contacts.location}</span>}
                {contacts.website && <span>{contacts.website}</span>}
              </div>
            </div>
            {photo && (
              <img src={photo} alt="Фото" className="resume-preview__photo" />
            )}
          </div>
        </div>
      )}

      <div className="resume-preview__body">
        {others.map((block, i) => (
          <Section key={i} block={block} color={color} templateId={template_id} />
        ))}
      </div>
    </div>
  )
}

function Section({ block, color, templateId }) {
  const { block_type, content } = block

  // Для современного шаблона — левая граница вместо нижней
  const titleStyle = templateId === 2
    ? { color, borderLeftColor: color }
    : templateId === 3
      ? {}
      : { color, borderColor: color }

  if (block_type === 'summary') {
    return (
      <div className="resume-preview__section">
        <div className="resume-preview__section-title" style={titleStyle}>О себе</div>
        <p className="resume-preview__text">{content.text}</p>
      </div>
    )
  }

  if (block_type === 'experience') {
    return (
      <div className="resume-preview__section">
        <div className="resume-preview__section-title" style={titleStyle}>Опыт работы</div>
        {(content.items || []).map((item, i) => (
          <div key={i} className="resume-preview__item">
            <div className="resume-preview__item-row">
              <span className="resume-preview__item-title">{item.position}</span>
              <span className="resume-preview__item-date">{item.start_date} — {item.end_date || 'н.в.'}</span>
            </div>
            <div className="resume-preview__item-sub" style={{ color }}>{item.company}</div>
            {item.description && <p className="resume-preview__item-desc">{item.description}</p>}
          </div>
        ))}
      </div>
    )
  }

  if (block_type === 'education') {
    return (
      <div className="resume-preview__section">
        <div className="resume-preview__section-title" style={titleStyle}>Образование</div>
        {(content.items || []).map((item, i) => (
          <div key={i} className="resume-preview__item">
            <div className="resume-preview__item-row">
              <span className="resume-preview__item-title">{item.institution}</span>
              <span className="resume-preview__item-date">{item.year}</span>
            </div>
            <div className="resume-preview__item-sub" style={{ color }}>{item.degree}</div>
          </div>
        ))}
      </div>
    )
  }

  if (block_type === 'skills' || block_type === 'languages') {
    const title = block_type === 'skills' ? 'Навыки' : 'Языки'
    return (
      <div className="resume-preview__section">
        <div className="resume-preview__section-title" style={titleStyle}>{title}</div>
        <div className="resume-preview__chips">
          {(content.items || []).map((item, i) => (
            <span key={i} className="resume-preview__chip" style={{ color, borderColor: color }}>{item}</span>
          ))}
        </div>
      </div>
    )
  }

  if (block_type === 'projects') {
    return (
      <div className="resume-preview__section">
        <div className="resume-preview__section-title" style={titleStyle}>Проекты</div>
        {(content.items || []).map((item, i) => (
          <div key={i} className="resume-preview__item">
            <span className="resume-preview__item-title">{item.name}</span>
            {item.description && <p className="resume-preview__item-desc">{item.description}</p>}
            {item.url && <span className="resume-preview__item-url">{item.url}</span>}
          </div>
        ))}
      </div>
    )
  }

  return null
}
