import { useState } from 'react'
import { uploadPhoto } from '../../api/upload'
import { useResumeStore } from '../../store/resumeStore'
import '../../styles/blockForms.css'
import '../../styles/photoForm.css'

export default function PhotoForm({ index, content }) {
  const { updateBlock } = useResumeStore()
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const handleFile = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    setError('')
    setUploading(true)
    try {
      const url = await uploadPhoto(file)
      updateBlock(index, { ...content, url })
    } catch {
      setError('Ошибка загрузки фото')
    } finally {
      setUploading(false)
    }
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
            disabled={uploading}
          />
          <span className="photo-form__upload-icon">📷</span>
          <span className="photo-form__upload-text">
            {uploading ? 'Загрузка...' : 'Нажмите чтобы загрузить фото'}
          </span>
          <span className="photo-form__upload-hint">JPG, PNG до 5 МБ</span>
        </label>
      )}
      {error && <p className="block-form__error-msg">{error}</p>}
    </div>
  )
}
