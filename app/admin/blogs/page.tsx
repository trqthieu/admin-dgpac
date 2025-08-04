"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus, Edit, Trash2, Search, Calendar, Tag } from "lucide-react"
import { Input } from "@/components/ui/input"
import { BlogForm } from "@/components/blog-form"
import { Badge } from "@/components/ui/badge"

interface Blog {
  id: string
  title: string
  tag: string
  description: string
  createdAt: string
  updatedAt: string
}

const mockBlogs: Blog[] = [
  {
    id: "1",
    title: "Getting Started with Chemical Processing",
    tag: "chemicals",
    description:
      "# Introduction\n\nThis blog post covers the **basics** of chemical processing and how to get started in the industry.\n\n## Key Points\n\n- Safety first\n- Understanding processes\n- Quality control\n\n> Remember: Always follow safety protocols when working with chemicals.",
    createdAt: "2024-01-15",
    updatedAt: "2024-01-15",
  },
  {
    id: "2",
    title: "Oil Industry Trends 2024",
    tag: "oil",
    description:
      "# Oil Industry Outlook\n\nThe oil industry is experiencing significant changes in 2024. Here are the key trends:\n\n1. **Sustainability initiatives**\n2. Digital transformation\n3. Market volatility\n\n```javascript\nconst trends = ['sustainability', 'digital', 'volatility'];\n```",
    createdAt: "2024-01-10",
    updatedAt: "2024-01-12",
  },
]

export default function BlogsPage() {
  const [blogs, setBlogs] = useState<Blog[]>(mockBlogs)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null)
  const [searchTerm, setSearchTerm] = useState("")

  const handleAddBlog = (blogData: Omit<Blog, "id" | "createdAt" | "updatedAt">) => {
    const newBlog: Blog = {
      ...blogData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString().split("T")[0],
      updatedAt: new Date().toISOString().split("T")[0],
    }
    setBlogs([newBlog, ...blogs])
    setIsFormOpen(false)
  }

  const handleEditBlog = (blogData: Omit<Blog, "id" | "createdAt" | "updatedAt">) => {
    if (editingBlog) {
      setBlogs(
        blogs.map((b) =>
          b.id === editingBlog.id
            ? {
                ...blogData,
                id: editingBlog.id,
                createdAt: editingBlog.createdAt,
                updatedAt: new Date().toISOString().split("T")[0],
              }
            : b,
        ),
      )
      setEditingBlog(null)
      setIsFormOpen(false)
    }
  }

  const handleDeleteBlog = (id: string) => {
    setBlogs(blogs.filter((b) => b.id !== id))
  }

  const filteredBlogs = blogs.filter(
    (blog) =>
      blog.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      blog.tag.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const getTagColor = (tag: string) => {
    switch (tag.toLowerCase()) {
      case "chemicals":
        return "bg-blue-100 text-blue-800"
      case "oil":
        return "bg-orange-100 text-orange-800"
      case "technology":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const truncateDescription = (description: string, maxLength = 150) => {
    // Remove markdown formatting for preview
    const plainText = description
      .replace(/[#*`>]/g, "")
      .replace(/\n/g, " ")
      .trim()

    return plainText.length > maxLength ? plainText.substring(0, maxLength) + "..." : plainText
  }

  return (
    <div className="flex flex-1 flex-col gap-4 p-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Blogs</h1>
          <p className="text-muted-foreground">Manage your blog content</p>
        </div>
        <Button onClick={() => setIsFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Blog
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search blogs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredBlogs.map((blog) => (
          <Card key={blog.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{blog.title}</CardTitle>
                  <div className="flex items-center space-x-2 mb-2">
                    <Badge className={getTagColor(blog.tag)}>
                      <Tag className="w-3 h-3 mr-1" />
                      {blog.tag}
                    </Badge>
                  </div>
                  <div className="flex items-center text-xs text-muted-foreground space-x-4">
                    <div className="flex items-center">
                      <Calendar className="w-3 h-3 mr-1" />
                      Created: {blog.createdAt}
                    </div>
                  </div>
                  {blog.updatedAt !== blog.createdAt && (
                    <div className="flex items-center text-xs text-muted-foreground mt-1">
                      <Calendar className="w-3 h-3 mr-1" />
                      Updated: {blog.updatedAt}
                    </div>
                  )}
                </div>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditingBlog(blog)
                      setIsFormOpen(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteBlog(blog.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1">
              <CardDescription className="text-sm">{truncateDescription(blog.description)}</CardDescription>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredBlogs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No blogs found matching your search.</p>
        </div>
      )}

      {isFormOpen && (
        <BlogForm
          blog={editingBlog}
          onSubmit={editingBlog ? handleEditBlog : handleAddBlog}
          onCancel={() => {
            setIsFormOpen(false)
            setEditingBlog(null)
          }}
        />
      )}
    </div>
  )
}
