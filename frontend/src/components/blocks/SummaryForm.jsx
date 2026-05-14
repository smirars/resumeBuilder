import { useResumeStore } from '../../store/resumeStore'
import '../../styles/blockForms.css'

export default function SummaryForm({ index, content }) {
  const { updateBlock } = useResumeStore()

  return (
    <div className="block-form">
      <label className="block-form__field">
        <span className="block-form__label">Текст</span>
        <textarea
          className="block-form__textarea"
          rows={5}
          value={content.text || ''}
          onChange={(e) => updateBlock(index, { ...content, text: e.target.value })}
        />
      </label>
    </div>
  )
}
