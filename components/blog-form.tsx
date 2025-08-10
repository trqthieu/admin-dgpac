"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import { CodeEditor } from "@/components/code-editor"

interface Blog {
  _id?: string
  title: string
  link: string
  tag: string
  // description: string
  createdAt?: string
  updatedAt?: string
}

interface BlogFormProps {
  blog?: Blog | null
  onSubmit: (blog: Omit<Blog, "_id" | "createdAt" | "updatedAt">) => void
  onCancel: () => void
}

export function BlogForm({ blog, onSubmit, onCancel }: BlogFormProps) {
  const [formData, setFormData] = useState({
    title: blog?.title || "",
    link: blog?.link || "",
    tag: blog?.tag || "",
    // description: blog?.description || "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{blog ? "Edit Blog" : "Add New Blog"}</CardTitle>
              <CardDescription>{blog ? "Update blog content" : "Create a new blog post"}</CardDescription>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Blog Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Enter blog title"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tag">Tag</Label>
                <Input
                  id="tag"
                  value={formData.tag}
                  onChange={(e) => setFormData((prev) => ({ ...prev, tag: e.target.value }))}
                  placeholder="e.g., chemicals, oil, technology"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Blog Link</Label>
                <Input
                  id="title"
                  value={formData.link}
                  onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
                  placeholder="Enter blog title"
                  required
                />
              </div>
            </div>

            {/* <div className="space-y-2">
              <Label htmlFor="description">Content</Label>
              <CodeEditor
                value={formData.description}
                onChange={(value) => setFormData((prev) => ({ ...prev, description: value }))}
                placeholder="Start writing your blog content... You can use Markdown formatting!"
              />
              <p className="text-xs text-muted-foreground">
                Supports Markdown formatting: **bold**, *italic*, `code`, # headings, &gt; quotes, - lists, and more.
              </p>
            </div> */}

            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit">{blog ? "Update Blog" : "Create Blog"}</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
