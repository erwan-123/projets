// components/editor/MenuBar.tsx
"use client"

import { Editor } from '@tiptap/react'
import { Button } from '@/components/ui/Button'

interface MenuBarProps {
  editor: Editor
}

export function MenuBar({ editor }: MenuBarProps) {
  if (!editor) return null

  const addImage = () => {
    const url = prompt('Entrez l\'URL de l\'image:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }

  const addLink = () => {
    const url = prompt('Entrez l\'URL du lien:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }

  return (
    <div className="flex flex-wrap gap-1 p-2">
      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition ${
            editor.isActive('bold') ? 'bg-gray-200' : ''
          }`}
          title="Gras (Ctrl+B)"
        >
          <strong>B</strong>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition ${
            editor.isActive('italic') ? 'bg-gray-200' : ''
          }`}
          title="Italique (Ctrl+I)"
        >
          <em>I</em>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition ${
            editor.isActive('underline') ? 'bg-gray-200' : ''
          }`}
          title="Souligné (Ctrl+U)"
        >
          <u>U</u>
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition ${
            editor.isActive('strike') ? 'bg-gray-200' : ''
          }`}
          title="Barré"
        >
          <s>S</s>
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition text-xs ${
            editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''
          }`}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition text-xs ${
            editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''
          }`}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition text-xs ${
            editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''
          }`}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition ${
            editor.isActive('paragraph') ? 'bg-gray-200' : ''
          }`}
          title="Paragraphe"
        >
          ¶
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition ${
            editor.isActive('bulletList') ? 'bg-gray-200' : ''
          }`}
          title="Liste à puces"
        >
          • Liste
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition ${
            editor.isActive('orderedList') ? 'bg-gray-200' : ''
          }`}
          title="Liste numérotée"
        >
          1. Liste
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition ${
            editor.isActive('blockquote') ? 'bg-gray-200' : ''
          }`}
          title="Citation"
        >
          "
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={`p-1.5 rounded hover:bg-gray-200 transition ${
            editor.isActive('codeBlock') ? 'bg-gray-200' : ''
          }`}
          title="Code"
        >
          &lt;/&gt;
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <div className="flex items-center gap-1">
        <button
          onClick={addLink}
          className="p-1.5 rounded hover:bg-gray-200 transition"
          title="Ajouter un lien"
        >
          🔗
        </button>
        <button
          onClick={addImage}
          className="p-1.5 rounded hover:bg-gray-200 transition"
          title="Ajouter une image"
        >
          🖼️
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          className="p-1.5 rounded hover:bg-gray-200 transition"
          title="Annuler (Ctrl+Z)"
          disabled={!editor.can().undo()}
        >
          ↩️
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          className="p-1.5 rounded hover:bg-gray-200 transition"
          title="Rétablir (Ctrl+Y)"
          disabled={!editor.can().redo()}
        >
          ↪️
        </button>
      </div>

      <div className="w-px h-6 bg-gray-300 mx-1" />

      <div className="flex items-center gap-1">
        <button
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className="p-1.5 rounded hover:bg-gray-200 transition"
          title="Aligner à gauche"
        >
          ⬅️
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className="p-1.5 rounded hover:bg-gray-200 transition"
          title="Centrer"
        >
          ⬆️
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className="p-1.5 rounded hover:bg-gray-200 transition"
          title="Aligner à droite"
        >
          ➡️
        </button>
        <button
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className="p-1.5 rounded hover:bg-gray-200 transition"
          title="Justifier"
        >
          ↔️
        </button>
      </div>
    </div>
  )
}