'use client'

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import { useRef } from 'react'
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  Undo,
  Redo,
} from 'lucide-react'
import api from '@/lib/admin/api'

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
}

const MenuButton = ({
  onClick,
  isActive,
  children,
  title,
}: {
  onClick: () => void
  isActive?: boolean
  children: React.ReactNode
  title: string
}) => (
  <button
    type="button"
    onClick={onClick}
    title={title}
    className={`p-2 rounded transition-colors ${
      isActive
        ? 'bg-action-primary text-white'
        : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
    }`}
  >
    {children}
  </button>
)

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  if (!editor) return null

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await api.post('/admin/guides/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      const { url } = response.data
      editor.chain().focus().setImage({ src: url }).run()
    } catch (error) {
      console.error('Failed to upload image:', error)
      alert('이미지 업로드에 실패했습니다')
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="border-b border-border p-2 flex flex-wrap gap-1">
      <MenuButton
        onClick={() => editor.chain().focus().toggleBold().run()}
        isActive={editor.isActive('bold')}
        title="굵게"
      >
        <Bold className="w-4 h-4" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleItalic().run()}
        isActive={editor.isActive('italic')}
        title="기울임"
      >
        <Italic className="w-4 h-4" />
      </MenuButton>

      <div className="w-px bg-border mx-1" />

      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        isActive={editor.isActive('heading', { level: 1 })}
        title="제목 1"
      >
        <Heading1 className="w-4 h-4" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        isActive={editor.isActive('heading', { level: 2 })}
        title="제목 2"
      >
        <Heading2 className="w-4 h-4" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
        isActive={editor.isActive('heading', { level: 3 })}
        title="제목 3"
      >
        <Heading3 className="w-4 h-4" />
      </MenuButton>

      <div className="w-px bg-border mx-1" />

      <MenuButton
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        isActive={editor.isActive('bulletList')}
        title="글머리 기호 목록"
      >
        <List className="w-4 h-4" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        isActive={editor.isActive('orderedList')}
        title="번호 매기기 목록"
      >
        <ListOrdered className="w-4 h-4" />
      </MenuButton>

      <div className="w-px bg-border mx-1" />

      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        isActive={editor.isActive({ textAlign: 'left' })}
        title="왼쪽 정렬"
      >
        <AlignLeft className="w-4 h-4" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        isActive={editor.isActive({ textAlign: 'center' })}
        title="가운데 정렬"
      >
        <AlignCenter className="w-4 h-4" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        isActive={editor.isActive({ textAlign: 'right' })}
        title="오른쪽 정렬"
      >
        <AlignRight className="w-4 h-4" />
      </MenuButton>

      <div className="w-px bg-border mx-1" />

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />
      <MenuButton
        onClick={() => fileInputRef.current?.click()}
        title="이미지 삽입"
      >
        <ImageIcon className="w-4 h-4" />
      </MenuButton>

      <div className="w-px bg-border mx-1" />

      <MenuButton
        onClick={() => editor.chain().focus().undo().run()}
        title="실행 취소"
      >
        <Undo className="w-4 h-4" />
      </MenuButton>

      <MenuButton
        onClick={() => editor.chain().focus().redo().run()}
        title="다시 실행"
      >
        <Redo className="w-4 h-4" />
      </MenuButton>
    </div>
  )
}

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
    ],
    content,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML())
    },
    editorProps: {
      attributes: {
        class: 'tiptap-editor',
      },
    },
  })

  return (
    <div className="border border-border rounded-card overflow-hidden bg-white">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}
