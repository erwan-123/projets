// components/editor/Editor.tsx
"use client"

import { useEditor, EditorContent, BubbleMenu, FloatingMenu } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Image from '@tiptap/extension-image'
import { CharacterCount } from '@tiptap/extension-character-count'
import { useState, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/Button'
import { Toolbar } from './Toolbar'
import { MenuBar } from './MenuBar'

interface EditorProps {
  content: string
  onChange: (content: string) => void
  readOnly?: boolean
  placeholder?: string
  onSave?: () => void
  onVersionSave?: (comment: string) => void
}

export function Editor({
  content,
  onChange,
  readOnly = false,
  placeholder = 'Commencez à rédiger votre mémoire...',
  onSave,
  onVersionSave,
}: EditorProps) {
  const [wordCount, setWordCount] = useState(0)
  const [characterCount, setCharacterCount] = useState(0)
  const [isClient, setIsClient] = useState(false)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3, 4],
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-blue-600 underline',
        },
      }),
      Image,
      Placeholder.configure({
        placeholder,
        emptyEditorClass: 'is-editor-empty',
      }),
      CharacterCount.configure({
        limit: 50000,
      }),
    ],
    content,
    editable: !readOnly,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML()
      onChange(html)
      const { words, characters } = editor.storage.characterCount || { words: 0, characters: 0 }
      setWordCount(words)
      setCharacterCount(characters)
    },
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] px-4 py-2',
      },
    },
  })

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (editor && content && !editor.isDestroyed) {
      const currentContent = editor.getHTML()
      if (currentContent !== content) {
        editor.commands.setContent(content)
      }
    }
  }, [content, editor])

  // Sauvegarde automatique toutes les 30 secondes
  useEffect(() => {
    if (!editor || readOnly) return

    const interval = setInterval(() => {
      if (onSave) onSave()
    }, 30000)

    return () => clearInterval(interval)
  }, [editor, onSave, readOnly])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Ctrl+S pour sauvegarder
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      if (onSave) onSave()
    }
  }

  if (!isClient) {
    return (
      <div className="border rounded-lg p-4 bg-gray-50 min-h-[500px]">
        <p className="text-gray-400 text-center">Chargement de l'éditeur...</p>
      </div>
    )
  }

  if (!editor) {
    return null
  }

  return (
    <div className="border rounded-lg bg-white shadow-sm overflow-hidden">
      {!readOnly && (
        <div className="border-b bg-gray-50">
          <MenuBar editor={editor} />
        </div>
      )}

      <div className="relative" onKeyDown={handleKeyDown}>
        {editor && !readOnly && (
          <BubbleMenu editor={editor} className="bg-white shadow-lg rounded-lg border p-1 flex gap-1">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('bold') ? 'bg-gray-200' : ''}`}
            >
              <strong>B</strong>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('italic') ? 'bg-gray-200' : ''}`}
            >
              <em>I</em>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleUnderline().run()}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('underline') ? 'bg-gray-200' : ''}`}
            >
              <u>U</u>
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('strike') ? 'bg-gray-200' : ''}`}
            >
              <s>S</s>
            </button>
            <div className="w-px bg-gray-300" />
            <button
              onClick={() => editor.chain().focus().setParagraph().run()}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('paragraph') ? 'bg-gray-200' : ''}`}
            >
              ¶
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}`}
            >
              H1
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}`}
            >
              H2
            </button>
            <button
              onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
              className={`p-1 rounded hover:bg-gray-100 ${editor.isActive('heading', { level: 3 }) ? 'bg-gray-200' : ''}`}
            >
              H3
            </button>
          </BubbleMenu>
        )}

        <EditorContent editor={editor} className="editor-content" />

        {!readOnly && (
          <div className="border-t bg-gray-50 px-4 py-2 flex justify-between items-center text-sm text-gray-500">
            <div className="flex gap-4">
              <span>📝 {wordCount} mots</span>
              <span>🔤 {characterCount} caractères</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const comment = prompt('Commentaire de version (optionnel):')
                  if (onVersionSave) onVersionSave(comment || '')
                }}
                className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
              >
                💾 Enregistrer version
              </button>
              <button
                onClick={onSave}
                className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
              >
                💾 Sauvegarder
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}