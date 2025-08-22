"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  Bold, 
  Italic, 
  Underline, 
  List, 
  ListOrdered, 
  Link, 
  ImageIcon, 
  Code, 
  Quote, 
  Eye, 
  Edit, 
  Upload,
  X
} from "lucide-react"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  onImageUpload?: (file: File) => Promise<string>
  placeholder?: string
}

export function CodeEditor({ 
  value, 
  onChange, 
  onImageUpload, 
  placeholder = "Start writing..." 
}: CodeEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadedImages, setUploadedImages] = useState<Array<{file: File; preview: string; name: string}>>([])
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const insertText = (before: string, after = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end)
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newText)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length)
    }, 0)
  }

  const handleImageUpload = async (file: File) => {
    if (!onImageUpload) {
      // If no upload handler provided, just insert the image placeholder
      insertText("![", "](image-url)")
      return
    }

    setIsUploading(true)
    try {
      const imageUrl = await onImageUpload(file)
      insertText("![", `](${process.env.NEXT_PUBLIC_API_URL}/${imageUrl})`)
    } catch (error) {
      console.error('Image upload failed:', error)
      // Fallback to placeholder if upload fails
      insertText("![", "](image-url)")
    } finally {
      setIsUploading(false)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const files = Array.from(e.dataTransfer.files).filter(file => 
      file.type.startsWith('image/')
    )
    
    if (files.length > 0 && onImageUpload) {
      files.forEach(handleImageUpload)
    }
  }

  const formatText = (type: string) => {
    switch (type) {
      case "bold":
        insertText("**", "**")
        break
      case "italic":
        insertText("*", "*")
        break
      case "underline":
        insertText("<u>", "</u>")
        break
      case "code":
        insertText("`", "`")
        break
      case "quote":
        insertText("> ")
        break
      case "ul":
        insertText("- ")
        break
      case "ol":
        insertText("1. ")
        break
      case "link":
        insertText("[", "](url)")
        break
      case "image":
        // Trigger file input click for image upload
        fileInputRef.current?.click()
        break
      case "h1":
        insertText("# ")
        break
      case "h2":
        insertText("## ")
        break
      case "h3":
        insertText("### ")
        break
    }
  }

  const renderPreview = (text: string) => {
    // Enhanced markdown preview with image support
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 py-0.5 rounded text-sm">$1</code>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-4 mt-6">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-3 mt-5">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-2 mt-4">$1</h3>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4 text-gray-600">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li class="ml-6 list-disc">$1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-6 list-decimal">$1</li>')
      .replace(/!\[(.*?)\]\((.*?)\)/g, '<img src="$2" alt="$1" class="my-4 rounded-lg max-w-full h-auto" />')
      .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
      .replace(/\n\n/g, '</p><p>')
      .replace(/\n/g, '<br>')
      .replace(/<p>(.*?)<\/p>/g, '<p class="mb-4">$1</p>')
  }

  return (
    <Card className="w-full">
      {/* Hidden file input for image uploads */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        accept="image/*"
        className="hidden"
      />

      <div className="border-b p-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-1">
            <Button type="button" variant="ghost" size="sm" onClick={() => formatText("bold")} title="Bold">
              <Bold className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => formatText("italic")} title="Italic">
              <Italic className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => formatText("underline")} title="Underline">
              <Underline className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <Button type="button" variant="ghost" size="sm" onClick={() => formatText("ul")} title="Bullet List">
              <List className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => formatText("ol")} title="Numbered List">
              <ListOrdered className="h-4 w-4" />
            </Button>
            <div className="w-px h-6 bg-gray-300 mx-1" />
            <Button type="button" variant="ghost" size="sm" onClick={() => formatText("link")} title="Link">
              <Link className="h-4 w-4" />
            </Button>
            <Button 
              type="button" 
              variant="ghost" 
              size="sm" 
              onClick={() => formatText("image")} 
              title="Insert Image"
              disabled={isUploading}
            >
              {isUploading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <ImageIcon className="h-4 w-4" />
              )}
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => formatText("code")} title="Code">
              <Code className="h-4 w-4" />
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => formatText("quote")} title="Quote">
              <Quote className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="secondary" className="text-xs">
              {value.length} characters
            </Badge>
            <Button type="button" variant="ghost" size="sm" onClick={() => setIsPreview(!isPreview)}>
              {isPreview ? <Edit className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {isPreview ? "Edit" : "Preview"}
            </Button>
          </div>
        </div>
      </div>

      <div 
        className="p-4 relative"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {isPreview ? (
          <div 
            className="min-h-[300px] prose max-w-none"
            dangerouslySetInnerHTML={{ __html: renderPreview(value) }} 
          />
        ) : (
          <>
            {/* Drag overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-0 hover:opacity-100 transition-opacity border-2 border-dashed border-blue-300 rounded-lg flex items-center justify-center bg-blue-50/50">
              <div className="text-center text-blue-600">
                <Upload className="h-8 w-8 mx-auto mb-2" />
                <p className="text-sm font-medium">Drop images here to upload</p>
              </div>
            </div>

            <textarea
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="w-full min-h-[300px] p-0 border-none outline-none resize-none font-mono text-sm leading-relaxed relative z-10"
              style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
            />
          </>
        )}
      </div>

      {/* Upload status */}
      {isUploading && (
        <div className="border-t p-2 bg-blue-50">
          <div className="flex items-center justify-center text-sm text-blue-600">
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
            Uploading image...
          </div>
        </div>
      )}
    </Card>
  )
}