'use client'

import { useEditor, EditorContent, Editor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TextAlign from '@tiptap/extension-text-align'
import Link from '@tiptap/extension-link'
import Youtube from '@tiptap/extension-youtube'
import { useRef, useState, useCallback } from 'react'
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
  Link as LinkIcon,
  Youtube as YoutubeIconLucide,
  Quote,
  Minus,
  Code,
} from 'lucide-react'
import api from '@/lib/admin/api'
import TurndownService from 'turndown'
import { marked } from 'marked'

interface TipTapEditorProps {
  content: string
  onChange: (content: string) => void
}

type EditorMode = 'wysiwyg' | 'markdown'

const MenuButton = ({
  onClick,
  isActive,
  disabled,
  children,
  title,
}: {
  onClick: () => void
  isActive?: boolean
  disabled?: boolean
  children: React.ReactNode
  title: string
}) => (
  <button
    type="button"
    onClick={onClick}
    disabled={disabled}
    title={title}
    className={`p-2 rounded transition-colors ${
      disabled
        ? 'text-text-tertiary cursor-not-allowed'
        : isActive
        ? 'bg-action-primary text-white'
        : 'text-text-secondary hover:bg-bg-primary hover:text-text-primary'
    }`}
  >
    {children}
  </button>
)

const MenuBar = ({ editor, onImageUpload }: { editor: Editor | null; onImageUpload: () => void }) => {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')
  const [showYoutubeInput, setShowYoutubeInput] = useState(false)
  const [youtubeUrl, setYoutubeUrl] = useState('')

  if (!editor) return null

  const handleSetLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run()
    }
    setLinkUrl('')
    setShowLinkInput(false)
  }

  const handleRemoveLink = () => {
    editor.chain().focus().unsetLink().run()
    setShowLinkInput(false)
  }

  const handleAddYoutube = () => {
    if (youtubeUrl) {
      editor.commands.setYoutubeVideo({
        src: youtubeUrl,
        width: 640,
        height: 360,
      })
    }
    setYoutubeUrl('')
    setShowYoutubeInput(false)
  }

  return (
    <div className="border-b border-border p-2">
      <div className="flex flex-wrap gap-1">
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

        <MenuButton
          onClick={() => editor.chain().focus().toggleCode().run()}
          isActive={editor.isActive('code')}
          title="인라인 코드"
        >
          <Code className="w-4 h-4" />
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

        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="인용구"
        >
          <Quote className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="구분선"
        >
          <Minus className="w-4 h-4" />
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

        <MenuButton
          onClick={() => setShowLinkInput(!showLinkInput)}
          isActive={editor.isActive('link')}
          title="링크"
        >
          <LinkIcon className="w-4 h-4" />
        </MenuButton>

        <MenuButton onClick={onImageUpload} title="이미지 삽입">
          <ImageIcon className="w-4 h-4" />
        </MenuButton>

        <MenuButton
          onClick={() => setShowYoutubeInput(!showYoutubeInput)}
          title="유튜브 삽입"
        >
          <YoutubeIconLucide className="w-4 h-4" />
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

      {/* Link Input */}
      {showLinkInput && (
        <div className="flex items-center gap-2 mt-2 p-2 bg-bg-primary rounded-lg">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            placeholder="https://example.com"
            className="flex-1 px-3 py-1.5 text-small bg-white border border-border rounded focus:ring-2 focus:ring-action-primary"
            onKeyDown={(e) => e.key === 'Enter' && handleSetLink()}
          />
          <button
            type="button"
            onClick={handleSetLink}
            className="px-3 py-1.5 text-small bg-action-primary text-white rounded hover:bg-action-primary/90"
          >
            적용
          </button>
          {editor.isActive('link') && (
            <button
              type="button"
              onClick={handleRemoveLink}
              className="px-3 py-1.5 text-small bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
            >
              제거
            </button>
          )}
        </div>
      )}

      {/* Youtube Input */}
      {showYoutubeInput && (
        <div className="flex items-center gap-2 mt-2 p-2 bg-bg-primary rounded-lg">
          <input
            type="url"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="flex-1 px-3 py-1.5 text-small bg-white border border-border rounded focus:ring-2 focus:ring-action-primary"
            onKeyDown={(e) => e.key === 'Enter' && handleAddYoutube()}
          />
          <button
            type="button"
            onClick={handleAddYoutube}
            className="px-3 py-1.5 text-small bg-action-primary text-white rounded hover:bg-action-primary/90"
          >
            삽입
          </button>
        </div>
      )}
    </div>
  )
}

// HTML to Markdown 변환
const turndownService = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
})

// YouTube iframe 처리
turndownService.addRule('youtube', {
  filter: (node) => {
    return (
      node.nodeName === 'IFRAME' &&
      (node as HTMLIFrameElement).src?.includes('youtube')
    )
  },
  replacement: (_content, node) => {
    const src = (node as HTMLIFrameElement).src
    const match = src.match(/embed\/([^?]+)/)
    if (match) {
      return `\n\nhttps://www.youtube.com/watch?v=${match[1]}\n\n`
    }
    return ''
  },
})

export default function TipTapEditor({ content, onChange }: TipTapEditorProps) {
  const [mode, setMode] = useState<EditorMode>('wysiwyg')
  const [markdownContent, setMarkdownContent] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-action-primary underline',
        },
      }),
      Youtube.configure({
        HTMLAttributes: {
          class: 'w-full aspect-video rounded-lg',
        },
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !editor) return

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

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const triggerImageUpload = () => {
    fileInputRef.current?.click()
  }

  // 모드 전환 핸들러
  const handleModeChange = useCallback(
    (newMode: EditorMode) => {
      if (newMode === mode) return

      if (newMode === 'markdown' && editor) {
        // WYSIWYG → Markdown
        const html = editor.getHTML()
        const markdown = turndownService.turndown(html)
        setMarkdownContent(markdown)
      } else if (newMode === 'wysiwyg' && editor) {
        // Markdown → WYSIWYG
        const html = marked(markdownContent) as string
        editor.commands.setContent(html)
        onChange(html)
      }

      setMode(newMode)
    },
    [mode, editor, markdownContent, onChange]
  )

  // 마크다운 변경 핸들러
  const handleMarkdownChange = useCallback(
    (value: string) => {
      setMarkdownContent(value)
      // 실시간으로 HTML도 업데이트 (저장용)
      const html = marked(value) as string
      onChange(html)
    },
    [onChange]
  )

  return (
    <div className="border border-border rounded-card overflow-hidden bg-white">
      {/* Mode Tabs */}
      <div className="flex border-b border-border">
        <button
          type="button"
          onClick={() => handleModeChange('wysiwyg')}
          className={`flex-1 px-4 py-3 text-body font-medium transition-colors ${
            mode === 'wysiwyg'
              ? 'bg-white text-action-primary border-b-2 border-action-primary'
              : 'bg-bg-primary text-text-secondary hover:text-text-primary'
          }`}
        >
          위지윅 에디터
        </button>
        <button
          type="button"
          onClick={() => handleModeChange('markdown')}
          className={`flex-1 px-4 py-3 text-body font-medium transition-colors ${
            mode === 'markdown'
              ? 'bg-white text-action-primary border-b-2 border-action-primary'
              : 'bg-bg-primary text-text-secondary hover:text-text-primary'
          }`}
        >
          마크다운
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleImageUpload}
        className="hidden"
      />

      {mode === 'wysiwyg' ? (
        <>
          <MenuBar editor={editor} onImageUpload={triggerImageUpload} />
          <EditorContent editor={editor} />
        </>
      ) : (
        <div className="p-4">
          <textarea
            value={markdownContent}
            onChange={(e) => handleMarkdownChange(e.target.value)}
            className="w-full min-h-[400px] p-4 font-mono text-sm bg-bg-primary rounded-lg border border-border focus:ring-2 focus:ring-action-primary focus:border-transparent resize-y"
            placeholder="# 제목&#10;&#10;본문 내용을 마크다운으로 작성하세요...&#10;&#10;- 리스트 항목&#10;- 또 다른 항목&#10;&#10;**굵은 글씨**, *기울임*&#10;&#10;[링크](https://example.com)&#10;&#10;> 인용구"
          />
          <p className="mt-2 text-small text-text-tertiary">
            마크다운 문법을 사용하여 작성할 수 있습니다. 위지윅 탭으로 전환하면 미리보기가 가능합니다.
          </p>
        </div>
      )}
    </div>
  )
}
