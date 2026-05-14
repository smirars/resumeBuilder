import { useResumeStore } from '../../store/resumeStore'
import '../../styles/blockForms.css'
import '../../styles/photoForm.css'

export default function PhotoForm({ index, content }) {
  const { updateBlock } = useResumeStore()

  const handleFile = (e) => {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => updateBlock(index, { ...content, url: reader.result })
    reader.readAsDataURL(file)
  }

  const handleRemove = () => updateBlock(index, { ...content, url: '' })

  return (
    <div className="block-form">
      {content.url ? (
        <div className="photo-form__preview">
          <img src={content.url} alt="Фото" className="photo-form__img" />
          <button className="photo-form__remove-btn" onClick={handleRemove}>
            Удалить фото
          </button>
        </div>
      ) : (
        <label className="photo-form__upload-area">
          <input
            type="file"
            accept="image/*"
            onChange={handleFile}
            className="photo-form__file-input"
          />
          <span className="photo-form__upload-icon">📷</span>
          <span className="photo-form__upload-text">Нажмите чтобы загрузить фото</span>
          <span className="photo-form__upload-hint">JPG, PNG до 5 МБ</span>
        </label>
      )}
    </div>
  )
}
