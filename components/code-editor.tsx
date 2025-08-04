"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Bold, Italic, Underline, List, ListOrdered, Link, ImageIcon, Code, Quote, Eye, Edit } from "lucide-react"

interface CodeEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}

export function CodeEditor({ value, onChange, placeholder = "Start writing..." }: CodeEditorProps) {
  const [isPreview, setIsPreview] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

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
        insertText("![alt text](", ")")
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
    // Simple markdown-like preview (in a real app, use a proper markdown parser)
    return text
      .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.*?)\*/g, "<em>$1</em>")
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold mb-2">$1</h1>')
      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-bold mb-2">$1</h2>')
      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-bold mb-2">$1</h3>')
      .replace(/^> (.*$)/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic">$1</blockquote>')
      .replace(/^- (.*$)/gm, '<li class="ml-4">• $1</li>')
      .replace(/^\d+\. (.*$)/gm, '<li class="ml-4">$1</li>')
      .replace(/\n/g, "<br>")
  }

  return (
    <Card className="w-full">
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
            <Button type="button" variant="ghost" size="sm" onClick={() => formatText("image")} title="Image">
              <ImageIcon className="h-4 w-4" />
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

      <div className="p-4">
        {isPreview ? (
          <div className="min-h-[300px] prose max-w-none" dangerouslySetInnerHTML={{ __html: renderPreview(value) }} />
        ) : (
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className="w-full min-h-[300px] p-0 border-none outline-none resize-none font-mono text-sm leading-relaxed"
            style={{ fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace' }}
          />
        )}
      </div>
    </Card>
  )
}
