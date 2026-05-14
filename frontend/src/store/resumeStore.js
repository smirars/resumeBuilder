import { create } from 'zustand'
import { updateResume } from '../api/resumes'

export const useResumeStore = create((set, get) => ({
  resume: null,
  saving: false,

  setResume: (resume) => set({ resume }),

  setColor: async (color) => {
    const { resume } = get()
    const updated = { ...resume, color }
    set({ resume: updated })
    await updateResume(resume.id, { color })
  },

  setFont: async (font) => {
    const { resume } = get()
    const updated = { ...resume, font }
    set({ resume: updated })
    await updateResume(resume.id, { font })
  },

  updateBlock: async (index, content) => {
    const { resume } = get()
    const blocks = resume.blocks_data.map((b, i) =>
      i === index ? { ...b, content } : b
    )
    const updated = { ...resume, blocks_data: blocks }
    set({ resume: updated })
    await updateResume(resume.id, { blocks_data: blocks })
  },

  toggleBlock: async (index) => {
    const { resume } = get()
    const blocks = resume.blocks_data.map((b, i) =>
      i === index ? { ...b, visible: !b.visible } : b
    )
    const updated = { ...resume, blocks_data: blocks }
    set({ resume: updated })
    await updateResume(resume.id, { blocks_data: blocks })
  },

  reorderBlocks: async (oldIndex, newIndex) => {
    const { resume } = get()
    const blocks = [...resume.blocks_data]
    const [moved] = blocks.splice(oldIndex, 1)
    blocks.splice(newIndex, 0, moved)
    const reindexed = blocks.map((b, i) => ({ ...b, position: i }))
    set({ resume: { ...resume, blocks_data: reindexed } })
    await updateResume(resume.id, { blocks_data: reindexed })
  },
}))
