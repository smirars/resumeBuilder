import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useResumeStore } from '../../store/resumeStore'
import ContactsForm from '../blocks/ContactsForm'
import SummaryForm from '../blocks/SummaryForm'
import ExperienceForm from '../blocks/ExperienceForm'
import EducationForm from '../blocks/EducationForm'
import SkillsForm from '../blocks/SkillsForm'
import LanguagesForm from '../blocks/LanguagesForm'
import ProjectsForm from '../blocks/ProjectsForm'
import PhotoForm from '../blocks/PhotoForm'
import '../../styles/blockEditor.css'

const BLOCK_LABELS = {
  contacts: 'Контактная информация',
  summary: 'О себе',
  experience: 'Опыт работы',
  education: 'Образование',
  skills: 'Навыки',
  languages: 'Языки',
  projects: 'Проекты',
  photo: 'Фотография',
}

const FORMS = {
  contacts: ContactsForm,
  summary: SummaryForm,
  experience: ExperienceForm,
  education: EducationForm,
  skills: SkillsForm,
  languages: LanguagesForm,
  projects: ProjectsForm,
  photo: PhotoForm,
}

const EyeIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
)

const EyeOffIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
)

function SortableBlock({ block, index, open, setOpen, toggleBlock }) {
  const Form = FORMS[block.block_type]
  const isOpen = open === index

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: block.block_type })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 'auto',
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`block-editor__block${!block.visible ? ' block-editor__block--hidden' : ''}`}
    >
      <div className="block-editor__block-header">
        <span
          className="block-editor__drag-handle"
          {...attributes}
          {...listeners}
          title="Перетащить"
        >
          ⠿
        </span>
        <button className="block-editor__toggle-btn" onClick={() => setOpen(isOpen ? null : index)}>
          <span className="block-editor__arrow">{isOpen ? '▾' : '▸'}</span>
          <span className="block-editor__label">{BLOCK_LABELS[block.block_type] || block.block_type}</span>
        </button>
        {block.is_removable && (
          <button
            className={`block-editor__vis-btn${!block.visible ? ' block-editor__vis-btn--off' : ''}`}
            onClick={() => toggleBlock(index)}
            title={block.visible ? 'Скрыть блок' : 'Показать блок'}
          >
            {block.visible ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        )}
      </div>

      {isOpen && block.visible && Form && (
        <div className="block-editor__form">
          <Form index={index} content={block.content} />
        </div>
      )}
    </div>
  )
}

export default function BlockEditor() {
  const { resume, toggleBlock, reorderBlocks } = useResumeStore()
  const [open, setOpen] = useState(null)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } })
  )

  if (!resume) return null

  const handleDragEnd = ({ active, over }) => {
    if (!over || active.id === over.id) return
    const oldIndex = resume.blocks_data.findIndex((b) => b.block_type === active.id)
    const newIndex = resume.blocks_data.findIndex((b) => b.block_type === over.id)
    setOpen(null)
    reorderBlocks(oldIndex, newIndex)
  }

  return (
    <div className="block-editor">
      <h3 className="block-editor__title">Блоки резюме</h3>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={resume.blocks_data.map((b) => b.block_type)}
          strategy={verticalListSortingStrategy}
        >
          {resume.blocks_data.map((block, index) => (
            <SortableBlock
              key={block.block_type}
              block={block}
              index={index}
              open={open}
              setOpen={setOpen}
              toggleBlock={toggleBlock}
            />
          ))}
        </SortableContext>
      </DndContext>
    </div>
  )
}
